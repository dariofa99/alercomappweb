import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogNewEditUserComponent } from '../dialog-new-edit-user/dialog-new-edit-user.component';
import { RoleModel } from '../../models/roleModel';
import { TownModel } from '../../models/townModel';
import { DepartmentModel } from '../../models/departmentModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styles: [
  ]
})
export class UserAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastname', 'username','email','phone_number','address','town_id','status_id','action'];
  displayedColumnsSpanish: string[] = ['ID', 'Nombre', 'Apellido', 'Nombre de Usuario','Email','Número Teléfono','Dirección','Pueblo','Estado','Acción'];
  dataSource: MatTableDataSource<UserModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() users: UserModel[];
  @Input() roles: RoleModel[];
  @Input() departments: DepartmentModel[];
  @Input() towns: Array<TownModel[]>;

  constructor(private userService: UserService, private auth: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    //console.log(this.users);
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser(){
    this.dialog.open(DialogNewEditUserComponent, {
      data:{
        departments: this.departments,
        towns: this.towns,
        roles: this.roles,
      },
      width:'30%'
    })
  }

  editUser(user: any){
    this.dialog.open(DialogNewEditUserComponent,{
      data:{
        userEdit: user,
        departments: this.departments,
        towns: this.towns,
        roles: this.roles,
        isOnDepartment: true,
      },
      width: '30%'
    })
  }

  deleteUser(id:number){
    this.userService.deleteUser(this.auth.readToken(),id).subscribe({
      next: data => {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text: 'Usuario eliminado con éxito'
        });
        this.users = this.users.filter(item=>item.id!=id)
        this.dataSource = new MatTableDataSource(this.users);
      },
      error: error => {console.log('There was an error',error)}
    })
  }

}
