import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalaryDTO, SalaryService } from '../../../core/services/salary.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,MatFormFieldModule, MatButtonModule ],
  templateUrl: './salary-list.html'
})
export class SalaryList implements OnInit, AfterViewInit {

  private service = inject(SalaryService);
    private toastr = inject(ToastrService);

  displayedColumns: string[] = ['employeeId', 'basicSalary', 'bonus', 'deduction', 'effectiveFrom', 'actions'];
  dataSource = new MatTableDataSource<SalaryDTO>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() { this.load(); }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load() {
    this.service.getAll().subscribe({
      next: res => {
        this.dataSource.data = res;
      },

      error: () => {
        this.toastr.error('Failed to load salaries');
      }
    });
  }

  delete(id: number) {
    if (!confirm('Delete salary record?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.toastr.success('Salary record deleted successfully');
        this.load();
      },

      error: () => {
        this.toastr.error('Failed to delete salary record');
      }
    });
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
}
