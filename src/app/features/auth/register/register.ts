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

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    address: ['']
  });

  errorMessage = '';

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    // Make sure null values become empty strings
    const payload: RegisterDTO = {
      username: raw.username || '',
      email: raw.email || '',
      password: raw.password || '',
      phone: raw.phone || undefined,
      address: raw.address || undefined
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate(['/login']); // redirect to login after register
      },
      error: err => {
        console.error(err);
        this.errorMessage = err.error || 'Registration failed';
      }
    });
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
