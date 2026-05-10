import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PayrollService, type PayrollDTO } from '../../core/services/payroll.service';

@Component({
  selector: 'app-payroll-generate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './payroll-generate.html'
})
export class PayrollGenerate implements OnInit, AfterViewInit {
  private payrollService = inject(PayrollService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  displayedColumns: string[] = [
    'employeeId', 'totalSalary', 'tax', 'netSalary', 
    'payrollMonth', 'createdAt', 'updatedAt', 'actions'
  ];
  dataSource = new MatTableDataSource<PayrollDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.form = this.fb.group({
      month: ['']
    });
  }

  ngOnInit() {
    this.loadPayrolls();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  loadPayrolls() {
    this.payrollService.getAll().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.setupFilter();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  generatePayrolls() {
    const monthInput = this.form.value.month;
    if (!monthInput) {
      alert('Please select a month');
      return;
    }

    this.payrollService.generatePayrolls(monthInput).subscribe({
      next: (res: any) => {
        const payrolls = res.data;
        if (!payrolls || payrolls.length === 0) {
          alert('No payrolls generated.');
          return;
        }

        alert(`${payrolls.length} payroll(s) generated!`);
        this.dataSource.data = [...this.dataSource.data, ...payrolls];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error generating payrolls.');
      }
    });
  }

  deletePayroll(id: number) {
    if (!confirm('Delete this payroll?')) return;

    this.payrollService.delete(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
        alert('Deleted successfully!');
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: PayrollDTO, filter: string) => {
      const dataStr = `
        ${data.employeeId} ${data.totalSalary} ${data.tax} ${data.netSalary} 
        ${new Date(data.payrollMonth).toLocaleDateString()} 
        ${new Date(data.createdAt).toLocaleDateString()} 
        ${new Date(data.updatedAt).toLocaleDateString()}
      `.toLowerCase();
      return dataStr.includes(filter);
    };
  }
}
