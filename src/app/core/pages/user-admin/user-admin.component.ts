import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RoleModel } from '../../models/roleModel';
import { TownModel } from '../../models/townModel';
import { DepartmentModel } from '../../models/departmentModel';
import Swal from 'sweetalert2';
import { ReferencesService } from '../../services/references.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export class UserToDisplay{
  constructor(
    public id?: number,
    public name?: string,
    public lastname?: string,
    public username?: string,
    public email?: string,
    public phone_number?: string,
    public town?: string,
    public status?: string,
  ){}
}

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styles: [
  ]
})

export class UserAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastname', 'username','email','phone_number','town','status','action'];
  displayedColumnsSpanish: string[] = ['ID', 'Nombre', 'Apellido', 'Nombre de Usuario','Email','Número Teléfono','Municipio','Estado','Acción'];
  dataSource: MatTableDataSource<UserToDisplay>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  users: UserModel[];
  usersToDisplay: UserToDisplay[] = [];
  roles: RoleModel[];
  departments: DepartmentModel[];
  towns: Array<TownModel[]> = [];

  constructor(private userService: UserService, private auth: AuthService,
    private references: ReferencesService, private route: ActivatedRoute, public router: Router,
    private toastr: ToastrService) {
      this.user = this.route.snapshot.data['user'];
      this.users = this.route.snapshot.data['users'];
      this.departments = this.route.snapshot.data['departments'];
      this.towns = this.route.snapshot.data['towns'];
     }

  ngOnInit(): void {
    this.users.forEach(element => {
      this.usersToDisplay.push(new UserToDisplay(element.id,element.name,
        element.lastname,element.username,element.email,element.phone_number,
        element.town.town_name, element.status.reference_name))
    });

    this.dataSource = new MatTableDataSource(this.usersToDisplay);
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
    this.router.navigate(["/home/admin-users/add-user"]);
  }

  editUser(user: any){
    this.router.navigate(["/home/admin-users/edit-user/"+user.id]);
  }

  deleteUser(id:number){
    Swal({  
      title: 'Realmente deseas eliminar este usuario?',  
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {    
          this.userService.deleteUser(this.auth.readToken(),id).subscribe({
            next: data => {
              if(data['errors']!=undefined?data['errors'].length!=0:false){
                data['errors'].map(res => {
                  this.toastr.error(res);
                })
              }
              else{
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Usuario eliminado con éxito'
                });
                this.usersToDisplay = this.usersToDisplay.filter(item=>item.id!=id)
                this.dataSource = new MatTableDataSource(this.usersToDisplay);
              }
            },
            error: error => {
              Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
              console.log('There was an error',error)
            }
          });
        } else if (result) {    
       }
    });

    
  }

}
