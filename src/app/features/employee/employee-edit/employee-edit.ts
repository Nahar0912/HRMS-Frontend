import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeDTO, EmployeeUpdateDTO } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-edit.html',
})
export class EmployeeEdit implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id!: number;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contact: ['', [Validators.required]],
    position: ['', Validators.required],
    department: ['', Validators.required],
    accountNumber: ['', Validators.required],
    employmentStatus: ['Active', Validators.required],
  });

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (!paramId) {
      console.error('No employee ID provided');
      this.router.navigate(['/employees']);
      return;
    }

    this.id = Number(paramId);
    this.loadEmployee(this.id);
  }

  private loadEmployee(id: number) {
    this.service.getById(id).subscribe({
      next: (employee: EmployeeDTO) => {
        this.form.patchValue({
          name: employee.name,
          email: employee.email,
          contact: employee.contact,
          position: employee.position,
          department: employee.department,
          accountNumber: employee.accountNumber,
          employmentStatus: employee.employmentStatus,
        });
      },
      error: (err) => console.error('Failed to load employee:', err)
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: EmployeeUpdateDTO = this.form.value as EmployeeUpdateDTO;

    this.service.update(this.id, payload).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) => console.error('Failed to update employee:', err)
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
