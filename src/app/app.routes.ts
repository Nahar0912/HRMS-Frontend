import { Routes } from '@angular/router';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { EmployeeAdd } from './features/employee/employee-add/employee-add';
import { EmployeeEdit } from './features/employee/employee-edit/employee-edit';
import { SalaryList } from './features/salary/salary-list/salary-list';
import { SalaryAdd } from './features/salary/salary-add/salary-add';
import { SalaryEdit } from './features/salary/salary-edit/salary-edit';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { PayrollGenerate } from './features/payroll/payroll-generate';




export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'employees', component: EmployeeList, canActivate: [authGuard]},
  { path: 'employee/add', component: EmployeeAdd, canActivate: [authGuard] },
  { path: 'employee/edit/:id', component: EmployeeEdit, canActivate: [authGuard] },

  { path: 'salaries', component: SalaryList, canActivate: [authGuard] },
  { path: 'salary/add', component: SalaryAdd, canActivate: [authGuard] },
  { path: 'salary/edit/:id', component: SalaryEdit, canActivate: [authGuard] },

  { path: 'payrolls', component: PayrollGenerate, canActivate: [authGuard] },
  
];
