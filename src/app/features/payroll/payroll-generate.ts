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
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-payroll-generate',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,
  MatFormFieldModule, MatInputModule ],
  templateUrl: './payroll-generate.html'
})
export class PayrollGenerate implements OnInit, AfterViewInit {

  private payrollService = inject(PayrollService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);

  form: FormGroup;

  totalPayroll = 0;
  totalTax = 0;
  totalNetSalary = 0;
  totalEmployees = 0;

  displayedColumns: string[] = [
    'employeeId',
    'totalSalary',
    'tax',
    'netSalary',
    'payrollMonth',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<PayrollDTO>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    this.form = this.fb.group({ month: [''] });
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
        this.calculateSummary();
        this.cdr.detectChanges();
      },

      error: () => {
        this.toastr.error('Failed to load payrolls');
      }
    });
  }

  generatePayrolls() {
    const monthInput = this.form.value.month;
    if (!monthInput) {
      this.toastr.warning('Please select a month');
      return;
    }

    this.payrollService
      .generatePayrolls(monthInput)
      .subscribe({

        next: (res: any) => {
          const payrolls = res.data;
          if (!payrolls || payrolls.length === 0) {
            this.toastr.info('No payrolls generated');
            return;
          }
          this.toastr.success(`${payrolls.length} payroll(s) generated successfully`);
          this.loadPayrolls();
        },

        error: () => {
          this.toastr.error('Error generating payrolls');
        }
      });
  }

  deletePayroll(id: number) {
    this.payrollService.delete(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter( p => p.id !== id );
        this.calculateSummary();
        this.toastr.success('Payroll deleted successfully');
      },

      error: () => {
        this.toastr.error('Failed to delete payroll');
      }
    });
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  setupFilter() {
  this.dataSource.filterPredicate = (data: PayrollDTO, filter: string) => {

    const dataStr = `
      ${data.employeeId}
      ${data.totalSalary}
      ${data.tax}
      ${data.netSalary}
      ${new Date(data.payrollMonth).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toLowerCase()}
      ${new Date(data.createdAt).toLocaleDateString()}
      ${new Date(data.updatedAt).toLocaleDateString()}
    `.toLowerCase();

    return dataStr.includes(filter);
  };
}

  calculateSummary() {
    const data = this.dataSource.data;
    const uniqueEmployees = new Set(data.map(p => p.employeeId));
    this.totalEmployees = uniqueEmployees.size;
    this.totalPayroll = this.dataSource.data.reduce( (sum, item) => sum + item.totalSalary, 0 );
    this.totalTax = this.dataSource.data.reduce( (sum, item) => sum + item.tax, 0);
    this.totalNetSalary = this.dataSource.data.reduce((sum, item) => sum + item.netSalary, 0);
  }

  exportExcel() {
    const exportData = this.dataSource.data.map(p => ({
      EmployeeId: p.employeeId,
      TotalSalary: p.totalSalary,
      Tax: p.tax,
      NetSalary: p.netSalary,
      PayrollMonth: new Date(p.payrollMonth).toLocaleDateString(),
      CreatedAt: new Date(p.createdAt).toLocaleString(),
      UpdatedAt: new Date(p.updatedAt).toLocaleString()
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Payrolls: worksheet},
      SheetNames: ['Payrolls']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const fileData: Blob = new Blob(
      [excelBuffer],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'}
    );

    saveAs(fileData, 'Payroll_Report.xlsx');
    this.toastr.success('Excel report exported successfully');
  }
}