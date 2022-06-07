import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PermissionsList } from '../../const/permissionsList';
import { DepartmentModel } from '../../models/departmentModel';
import { RoleModel } from '../../models/roleModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { ReferencesService } from '../../services/references.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { UserService } from '../../services/user.service';
import { ChangeRoleDialogComponent } from '../change-rol-dialog/change-role-dialog.component';

@Component({
  selector: 'app-new-edit-user',
  templateUrl: './new-edit-user.component.html',
  styles: [],
})
export class NewEditUserComponent implements OnInit, AfterViewInit {
  user: UserModel;
  departments: DepartmentModel[];
  userForm!: FormGroup;
  userPasswordForm!: FormGroup;
  towns: TownModel[] = [];
  townsToDisplay: TownModel[] = [];
  townsArray: Array<TownModel[]> = [];
  roles: RoleModel[] = [];
  isOnDepartment = false;
  selectedDepartment: number = -1;
  selectedTown: number;
  selectedRole: number;
  actionBtn: string = 'Guardar';
  id: any;
  userByID: UserModel;
  hidePassword: boolean = true;
  roleName: string;
  showTextInPasswordEdit: string = 'Contraseña Actual';
  assignRole;
  hasAssignRole = false;
  editMe = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private references: ReferencesService,
    public router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private rolesPermissionsService: RolesPermissionsService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.assignRole = this.permissionsList.ASIGNAR_ROL;
    this.ngxPermissionsService.hasPermission(this.assignRole).then((result) => {
      this.hasAssignRole = result;
    });

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      town_id: ['', Validators.required],
      address: ['', Validators.required],
      phone_number: ['', Validators.required],
    });
    this.userPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      oldpassword: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id');
    this.user = this.route.snapshot.data['user'];
    this.userByID = this.route.snapshot.data['userByID'];
    this.departments = this.route.snapshot.data['departments'];
    this.towns = this.route.snapshot.data['towns'];
    this.departments.forEach((element) => {
      let townsAux = [];
      this.towns.forEach((elementInside) => {
        if (element.id == elementInside.department_id) {
          townsAux.push(elementInside);
        }
      });
      this.townsArray.push(townsAux);
    });
  }

  ngOnInit(): void {
    if (this.userByID != undefined) {
      this.actionBtn = 'Actualizar';
      this.userForm.removeControl('password');
      this.userForm.removeControl('password_confirmation');
      this.userForm.controls['name'].setValue(this.userByID.name);
      this.userForm.controls['lastname'].setValue(this.userByID.lastname);
      this.userForm.controls['username'].setValue(this.userByID.username);
      this.userForm.controls['email'].setValue(this.userByID.email);
      this.userForm.controls['town_id'].setValue(this.userByID.town_id);
      this.userForm.controls['address'].setValue(this.userByID.address);
      this.userForm.controls['phone_number'].setValue(
        this.userByID.phone_number
      );
      this.selectedTown = this.userByID.town_id;
      this.selectedRole =
        this.userByID.roles.length != 0 ? this.userByID.roles[0].id : -1;
      this.isOnDepartment = true;
      if (this.userByID.roles.length != 0) {
        this.roleName = this.userByID.roles[0].name;
      } else {
        this.roleName = '';
      }
      if (this.user.id != this.userByID.id) {
        this.showTextInPasswordEdit = 'Contraseña de Administrador';
      } else {
        this.showTextInPasswordEdit = 'Contraseña Actual';
      }
      if(this.user.id == this.userByID.id){
        this.editMe = true;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.userByID != undefined) {
      this.townsArray.forEach((element) => {
        element.forEach((elementInside) => {
          if (elementInside.id == this.userByID.town_id) {
            this.selectedDepartment = elementInside.department_id;
          }
          if (elementInside.department_id == this.selectedDepartment) {
            this.townsToDisplay = element;
          }
        });
      });
    }
  }

  onDepartmentSelected(event: any) {
    this.isOnDepartment = true;
    this.townsArray.forEach((element) => {
      element.forEach((elementInside) => {
        if (elementInside.department_id == event.value) {
          this.townsToDisplay = element;
        }
      });
    });
  }

  changeRoleDialog(user: any): void {
    this.rolesPermissionsService.getRoles(this.auth.readToken()).subscribe({
      next: (data) => {
        if (
          data['errors'] != undefined
            ? data['errors'].length != 0
            : false
        ) {
          data['errors'].map((res) => {
            this.toastr.error(res);
          });
        } else {
          this.roles = data;
          Swal({
            title: 'Realmente deseas cambiar el rol?',
            showCancelButton: true,
            confirmButtonText: `Si`,
            cancelButtonText: `No`,
          }).then((result) => {
            if (result.value) {
              const dialogRef = this.dialog.open(ChangeRoleDialogComponent, {
                width: '350px',
                data: { selectedRole: this.selectedRole, roles: this.roles },
              });
      
              dialogRef.afterClosed().subscribe((result) => {
                if (result != undefined) {
                  user.role_id = result;
                  this.userService
                    .putUser(this.auth.readToken(), user.id, user)
                    .subscribe({
                      next: (data) => {
                        if (
                          data['errors'] != undefined
                            ? data['errors'].length != 0
                            : false
                        ) {
                          data['errors'].map((res) => {
                            this.toastr.error(res);
                          });
                        } else {
                          this.selectedRole = result;
                          this.roles.forEach(element => {
                            if(result == element.id){
                              this.roleName = element.name;
                            }
                          });
                          Swal({
                            allowOutsideClick: false,
                            type: 'success',
                            text: 'Rol modificado con éxito',
                          });
                        }
                      },
                      error: (error) => {
                        Swal({
                          text: 'Ha ocurrido un error contacta a soporte@alercom.org',
                          type: 'error',
                        });
                        console.log('There was an error', error);
                      },
                    });
                }
              });
            } else if (result) {
            }
          });
        }
      },
      error: (error) => {
        Swal({
          text: 'Ha ocurrido un error contacta a soporte@alercom.org',
          type: 'error',
        });
        console.log('There was an error', error);
      },
    });
  }

  updatePassword() {
    this.userService
      .putUser(
        this.auth.readToken(),
        this.userByID.id,
        this.userPasswordForm.value
      )
      .subscribe({
        next: (data) => {
          if (
            data['errors'] != undefined ? data['errors'].length != 0 : false
          ) {
            data['errors'].map((res) => {
              this.toastr.error(res);
            });
          } else {
            this.userPasswordForm.reset();
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Contraseña actualizada con éxito',
            });
          }
        },
        error: (error) => {
          Swal({
            text: 'Ha ocurrido un error contacta a soporte@alercom.org',
            type: 'error',
          });
          console.log('There was an error', error);
        },
      });
  }

  addUser() {
    if (this.userForm.valid) {
      this.userService
        .postUser(this.auth.readToken(), this.userForm.value)
        .subscribe({
          next: (data) => {
            {
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Usuario creado con éxito',
                }).then((result) => {
                  this.router.navigate(['/home/admin-users']);
                });
              }
            }
          },
          error: (error) => {
            Swal({
              text: 'Ha ocurrido un error contacta a soporte@alercom.org',
              type: 'error',
            });
            console.log('There was an error', error);
          },
        });
    }
  }

  updateUser() {
    if (this.userForm.valid) {
      this.userService
        .putUser(this.auth.readToken(), this.userByID.id, this.userForm.value)
        .subscribe({
          next: (data) => {
            {
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Usuario actualizado con éxito',
                }).then((result) => {
                  if(this.editMe){
                    
                  }
                  else if(this.hasAssignRole){
                    this.router.navigate(['/home/admin-users']);
                  }
                  else{
                    this.router.navigate(['/home']);
                  }
                  
                });
              }
            }
          },
          error: (error) => {
            Swal({
              text: 'Ha ocurrido un error contacta a soporte@alercom.org',
              type: 'error',
            });
            console.log('There was an error', error);
          },
        });
    }
  }
}
