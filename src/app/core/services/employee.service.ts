import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeDTO {
  id: number;
  name: string;
  email: string;
  contact: string;
  position: string;
  department: string;
  accountNumber: string;
  employmentStatus: string;
}

export interface EmployeeCreateDTO {
  name: string;
  email: string;
  contact: string;
  position: string;
  department: string;
  accountNumber: string;
  employmentStatus: string;
}

export interface EmployeeUpdateDTO {
  name?: string;
  email?: string;
  contact?: string;
  position?: string;
  department?: string;
  accountNumber?: string;
  employmentStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:5066/Employee';

  constructor(private http: HttpClient) {}

  // Get all employees
  getAll(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(this.baseUrl);
  }

  // Get employee by id
  getById(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.baseUrl}/${id}`);
  }

  // Create employee
  create(dto: EmployeeCreateDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(this.baseUrl, dto);
  }

  // Update employee
  update(id: number, dto: EmployeeUpdateDTO): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.baseUrl}/${id}`, dto);
  }

  // Delete employee
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
