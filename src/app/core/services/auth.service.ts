import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5066/Auth';

  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  //Register
  register(data: RegisterDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  //Login
  login(data: LoginDTO): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.tokenSignal.set(res.token); 
        }
      })
    );
  }

  //Logout
  logout() {
    localStorage.removeItem('token');
    this.tokenSignal.set(null); 
  }

  //Get Token
  getToken(): string | null {
    return this.tokenSignal();
  }
}
