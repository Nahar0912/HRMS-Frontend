import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaryService, SalaryDTO } from '../../../core/services/salary.service';

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
    effectiveFrom: this.fb.control<string | null>(
      new Date().toISOString().substring(0, 10),
      Validators.required
    )
  });

  // For showing messages
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showMessage = false;

  ngOnInit() {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // Check if employeeId already exists
    this.service.getAll().subscribe({
      next: (salaries: SalaryDTO[]) => {
        const existing = salaries.find(s => s.employeeId === raw.employeeId);
        if (existing) {
          this.showAlert('Employee ID already has a salary!', 'error');
          return;
        }

        const payload: SalaryDTO = {
          employeeId: raw.employeeId!,
          basicSalary: raw.basicSalary!,
          bonus: raw.bonus!,
          deduction: raw.deduction!,
          effectiveFrom: raw.effectiveFrom ? new Date(raw.effectiveFrom) : new Date()
        };

        this.service.create(payload).subscribe({
          next: () => this.showAlert('Salary added successfully!', 'success', true),
          error: err => this.showAlert('Failed to add salary. Please try again.', 'error')
        });
      },
      error: err => this.showAlert('Failed to fetch salaries. Please try again.', 'error')
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

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.showMessage = false;
      if (redirect) this.router.navigate(['/salaries']);
    }, 3000);
  }
}
