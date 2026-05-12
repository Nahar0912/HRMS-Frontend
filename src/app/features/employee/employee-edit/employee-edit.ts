import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeDTO, EmployeeUpdateDTO } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './employee-edit.html',
})

export class EmployeeEdit implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  id!: number;

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

    const paramId = this.route.snapshot.paramMap.get('id');

    if (!paramId) {
      this.toastr.error('No employee ID provided');
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

    const payload = this.form.value as EmployeeUpdateDTO;

    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.toastr.success('Employee updated successfully');
        this.router.navigate(['/employees']);
      },

      error: () => {
        this.toastr.error('Failed to update employee');
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!( control && control.invalid && (control.dirty || control.touched));
  }
}