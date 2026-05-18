import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeDTO, EmployeeService } from '../../../core/services/employee.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,              MatFormFieldModule, MatButtonModule],
  templateUrl: './employee-list.html'
})

export class EmployeeList implements OnInit, AfterViewInit {

  private service = inject(EmployeeService);
  private toastr = inject(ToastrService);

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'contact',
    'position',
    'department',
    'accountNumber',
    'employmentStatus',
    'actions'
  ];

  dataSource = new MatTableDataSource<EmployeeDTO>([]);
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
        this.toastr.error('Failed to load employees');
      }
    });
  }

  delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.toastr.success('Employee deleted successfully');
        this.load();
      },

      error: () => {
        this.toastr.error('Failed to delete employee');
      }
    });
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
}