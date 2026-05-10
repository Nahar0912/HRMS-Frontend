import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryDTO {
  id?: number;
  employeeId: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  effectiveFrom: Date; 
}

export interface SalaryCreateDTO {
  employeeId: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  effectiveFrom: string; 
}

export interface SalaryUpdateDTO {
  basicSalary?: number;
  bonus?: number;
  deduction?: number;
  effectiveFrom?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private baseUrl = 'http://localhost:5066/Salary';

  constructor(private http: HttpClient) {}

  // Get all salaries
  getAll(): Observable<SalaryDTO[]> {
    return this.http.get<SalaryDTO[]>(this.baseUrl);
  }

  // Get salary by ID
  getById(id: number): Observable<SalaryDTO> {
    return this.http.get<SalaryDTO>(`${this.baseUrl}/${id}`);
  }

  // Create new salary
  create(dto: SalaryDTO): Observable<SalaryDTO> {
    const payload: SalaryCreateDTO = {
      employeeId: dto.employeeId,
      basicSalary: dto.basicSalary,
      bonus: dto.bonus,
      deduction: dto.deduction,
      effectiveFrom: dto.effectiveFrom.toISOString(), 
    };
    return this.http.post<SalaryDTO>(this.baseUrl, payload);
  }

  // Update salary by ID
  update(id: number, dto: SalaryDTO): Observable<SalaryDTO> {
    const payload: SalaryUpdateDTO = {
      basicSalary: dto.basicSalary,
      bonus: dto.bonus,
      deduction: dto.deduction,
      effectiveFrom: dto.effectiveFrom.toISOString(),
    };
    return this.http.put<SalaryDTO>(`${this.baseUrl}/${id}`, payload);
  }

  // Delete salary
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
