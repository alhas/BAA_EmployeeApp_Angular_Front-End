import {Component, Inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Employee} from './employee';
import {EmployeeService} from './employee.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BAA_EmployeeApp_Angular_Front-End';
  public employees: Employee[];
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService, @Inject(EmployeeService)deleteEmployee: Employee) {
    this.employees = [];
    this.deleteEmployee = deleteEmployee;

  }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    // @ts-ignore
    document.getElementById('add-employee-form').click();
    this.employeeService.newEmployees(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }


  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.editEmployee(employee.id, employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employee: number): void {
    this.employeeService.deleteEmployees(employee).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.midname.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.surname.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phoneNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.position.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
      this.employees = results;
      if (results.length === 0 || !key) {
        this.getEmployees();
      }
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {

    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';

    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');

    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');

    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');

    }

    // @ts-ignore
    container.appendChild(button);
    button.click();

  }


}
