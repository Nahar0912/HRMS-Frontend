import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, EmployeeDTO } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './employee-add.html'
})
export class EmployeeAdd implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  id?: number;

  form = this.fb.group({
    name: ['',[ Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['',[ Validators.required, Validators.email]],
    contact: ['',[ Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    position: ['',[ Validators.required, Validators.minLength(2)]],
    department: ['',[ Validators.required, Validators.minLength(2)]],
    accountNumber: ['',[ Validators.required, Validators.pattern(/^[0-9]{6,20}$/)]],
    employmentStatus: [ 'Active', Validators.required],

  });

  ngOnInit() {
    this.id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (this.id) {
      this.loadEmployee(this.id);
    }
  }

  private loadEmployee(id: number) {

    this.service.getById(id).subscribe({

      next: (employee: EmployeeDTO) => {
        this.form.patchValue(employee);
      },

      error: () => {
        this.toastr.error('Failed to load employee');
      }

    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fix validation errors');
      return;
    }

    const payload = this.form.value as EmployeeDTO;

    this.service.getAll().subscribe({

      next: (employees: EmployeeDTO[]) => {
        const employeeExists = employees.some(
          e => e.email.trim().toLowerCase() === payload.email.trim().toLowerCase() && e.id !== this.id
        );

        if (employeeExists) {
          this.toastr.error('Employee email already exists');
          return;
        }

        const action = this.id ? this.service.update(this.id, payload) : this.service.create(payload);

        action.subscribe({

          next: () => {
            this.toastr.success('Employee saved successfully!');
            this.router.navigate(['/employees']);
          },

          error: () => {
            this.toastr.error('Failed to save employee');
          }
        });

      },

      error: () => {
        this.toastr.error('Failed to fetch employees');
      }

    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}