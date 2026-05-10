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

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './salary-list.html'
})
export class SalaryList implements OnInit, AfterViewInit {

  private service = inject(SalaryService);

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
    this.service.getAll().subscribe(res => {
      this.dataSource.data = res;
    });
  }

  delete(id: number) {
    if (!confirm('Delete salary record?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }

  applyFilter(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }
}
