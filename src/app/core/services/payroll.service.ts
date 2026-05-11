import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO interface
export interface PayrollDTO {
  id: number;
  employeeId: number;
  totalSalary: number;
  tax: number;
  netSalary: number;
  payrollMonth: string; 
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private baseUrl = 'http://localhost:5066/payroll';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PayrollDTO[]> {
    return this.http.get<PayrollDTO[]>(this.baseUrl);
  }

  generatePayrolls(month: string): Observable<PayrollDTO[]> {
    const year = month.split('-')[0];
    const monthNum = month.split('-')[1];
    return this.http.post<PayrollDTO[]>(`${this.baseUrl}/generate?year=${year}&month=${monthNum}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
