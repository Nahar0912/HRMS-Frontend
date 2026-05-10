import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, EmployeeDTO } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.html'
})
export class EmployeeAdd implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id?: number;


  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contact: ['', Validators.required],
    position: ['', Validators.required],
    department: ['', Validators.required],
    accountNumber: ['', Validators.required],
    employmentStatus: ['Active', Validators.required]
  });

  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showMessage = false;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadEmployee(this.id);
    }
  }

  private loadEmployee(id: number) {
    this.service.getById(id).subscribe({
      next: (employee: EmployeeDTO) => this.form.patchValue(employee),
      error: (err) => this.showAlert('Failed to load employee.', 'error')
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: EmployeeDTO = this.form.value as EmployeeDTO;

    // Check if employee with same name & email exists
    this.service.getAll().subscribe({
      next: (employees: EmployeeDTO[]) => {
        const exists = employees.some(e =>
          e.name.trim().toLowerCase() === payload.name.trim().toLowerCase() &&
          e.email.trim().toLowerCase() === payload.email.trim().toLowerCase() &&
          e.id !== this.id 
        );

        if (exists) {
          this.showAlert('Employee with same Name and Email already exists!', 'error');
          return;
        }

        const action = this.id
          ? this.service.update(this.id, payload)
          : this.service.create(payload);

        action.subscribe({
          next: () => this.showAlert('Employee saved successfully!', 'success', true),
          error: () => this.showAlert('Employee already exist!', 'error')
        });
      },
      error: () => this.showAlert('Failed to fetch employees.', 'error')
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private showAlert(msg: string, type: 'success' | 'error' | 'info', redirect = false) {
    this.message = msg;
    this.messageType = type;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      if (redirect) this.router.navigate(['/employees']);
    }, 3000);
  }
}
