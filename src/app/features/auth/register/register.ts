import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterDTO } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
      Validators.minLength(6)]
    ],
    phone: ['', [Validators.pattern(/^[0-9]{11}$/)]],
    address: ['']
  });

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: RegisterDTO = this.form.getRawValue() as RegisterDTO;

    this.auth.register(payload).subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },

      error: err => {
        console.error(err);
        this.errorMessage = err.error || 'Registration failed';
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