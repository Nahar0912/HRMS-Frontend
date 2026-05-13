import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SalaryDTO, SalaryService } from '../../../core/services/salary.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-edit',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './salary-edit.html',
})

export class SalaryEdit implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(SalaryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  id!: number;
  employeeId: number | null = null;

  form: FormGroup<{
    basicSalary: FormControl<number | null>;
    bonus: FormControl<number | null>;
    deduction: FormControl<number | null>;
    effectiveFrom: FormControl<string | null>;
  }> = this.fb.group({    
    basicSalary: this.fb.control<number | null>(0,[ Validators.required, Validators.min(0)]),
    bonus: this.fb.control<number | null>(0, [ Validators.required, Validators.min(0)]),
    deduction: this.fb.control<number | null>(0,[ Validators.required, Validators.min(0)]),
    effectiveFrom: this.fb.control<string | null>(new Date().toISOString().substring(0, 10),Validators.required),
  });

  ngOnInit(): void {

    const paramId = this.route.snapshot.paramMap.get('id');

    if (!paramId) {
      this.toastr.error('No salary ID provided');
      this.router.navigate(['/salaries']);
      return;
    }

    this.id = Number(paramId);
    this.loadSalary(this.id);
  }

  private loadSalary(id: number): void {
    this.service.getById(id).subscribe({

      next: (salary: SalaryDTO) => {
        this.employeeId = salary.employeeId;
        this.form.patchValue({
          basicSalary: salary.basicSalary ?? 0,
          bonus: salary.bonus ?? 0,
          deduction: salary.deduction ?? 0,
          effectiveFrom: salary.effectiveFrom ? new Date( salary.effectiveFrom).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        });
      },

      error: () => {
        this.toastr.error('Failed to load salary');
        this.router.navigate(['/salaries']);
      },

    });
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fix validation errors');
      return;
    }

    const formValue = this.form.value;

    const payload: SalaryDTO = {
      id: this.id,
      employeeId: this.employeeId!,
      basicSalary: formValue.basicSalary ?? 0,
      bonus: formValue.bonus ?? 0,
      deduction: formValue.deduction ?? 0,
      effectiveFrom: formValue.effectiveFrom ? new Date(formValue.effectiveFrom) : new Date(),
    };

    this.service.update(this.id, payload).subscribe({

      next: () => {
        this.toastr.success('Salary updated successfully');
        this.router.navigate(['/salaries']);
      },

      error: () => {
        this.toastr.error('Failed to update salary');
      },
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}