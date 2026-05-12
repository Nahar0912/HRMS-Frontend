import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService, LoginDTO } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const payload = this.form.getRawValue() as LoginDTO;

    this.auth.login(payload).subscribe({

      next: (res: any) => {

        this.toastr.success('Login successful!');

        if (res?.token) {
          localStorage.setItem('token', res.token);
        }

        this.router.navigate(['/employees']);
      },

      error: err => {
        console.error(err);
        this.toastr.error(
          err?.error?.message || 'Login failed'
        );
      }

    });
  }

  hasError(controlName: string): boolean {

    const control = this.form.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }
}