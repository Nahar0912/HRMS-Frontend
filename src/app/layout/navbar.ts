import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {

  private auth = inject(AuthService);
  private router = inject(Router);

  mobileOpen = signal(false);
  isLoggedIn = this.auth.isLoggedIn;

  toggleMobileMenu() {
    this.mobileOpen.update(open => !open);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
