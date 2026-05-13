import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaryService, SalaryDTO } from '../../../core/services/salary.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-add.html'
})

export class SalaryAdd implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SalaryService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form: FormGroup<{
    employeeId: FormControl<number | null>;
    basicSalary: FormControl<number | null>;
    bonus: FormControl<number | null>;
    deduction: FormControl<number | null>;
    effectiveFrom: FormControl<string | null>;
  }> = this.fb.group({
    employeeId: this.fb.control<number | null>(null, Validators.required),
    basicSalary: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    bonus: this.fb.control<number | null>(0, [Validators.required, Validators.min(0)]),
    deduction: this.fb.control<number | null>(0, [Validators.required, Validators.min(0)]),
    effectiveFrom: this.fb.control<string | null>(new Date().toISOString().substring(0, 10), Validators.required)
  });

  ngOnInit() {}

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fix validation errors');
      return;
    }

    const formValue = this.form.getRawValue();

    this.service.getAll().subscribe({
      next: (salaries: SalaryDTO[]) => {
        const exists = salaries.some(s => s.employeeId === formValue.employeeId);
        if (exists) {
          this.toastr.error('Employee already has a salary!');
          return;
        }

        const payload: SalaryDTO = {
          employeeId: formValue.employeeId!,
          basicSalary: formValue.basicSalary!,
          bonus: formValue.bonus!,
          deduction: formValue.deduction!,
          effectiveFrom: formValue.effectiveFrom ? new Date(formValue.effectiveFrom) : new Date()
        };

        this.service.create(payload).subscribe({
          next: () => {
            this.toastr.success('Salary added successfully!');
            this.router.navigate(['/salaries']);
          },

          error: () => {
            this.toastr.error('Failed to add salary');
          }
        });
      },

      error: () => {
        this.toastr.error('Failed to fetch salaries');
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
