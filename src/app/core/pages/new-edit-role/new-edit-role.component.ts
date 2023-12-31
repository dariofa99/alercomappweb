import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { RoleAdapter, RoleModel } from '../../models/roleModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { PermissionsList } from '../../const/permissionsList';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-new-edit-role',
  templateUrl: './new-edit-role.component.html',
  styles: [],
})
export class NewEditRoleComponent implements OnInit {
  user: UserModel;
  roles: RoleModel[];
  roleForm!: FormGroup;
  actionBtn: string = 'Guardar';
  idToUpdate: number;
  

  createEditRolePermission = [];
  readRolePermission;
  createRolePermission;
  editRolePermission;
  deleteRolePermission;

  haseditRolePermission = false;
  hascreateRolePermission = false;

  isDisabledBtnSaveEdit = false;

  constructor(
    private auth: AuthService,
    private rolesPermissionsService: RolesPermissionsService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private adapterRole: RoleAdapter,
    private toastr: ToastrService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    
    this.createEditRolePermission.push(this.permissionsList.CREAR_ROLES,this.permissionsList.EDITAR_ROLES);
    this.readRolePermission = this.permissionsList.VER_ROLES;
    this.createRolePermission = this.permissionsList.CREAR_ROLES;
    this.editRolePermission = this.permissionsList.EDITAR_ROLES;
    this.deleteRolePermission = this.permissionsList.ELIMINAR_ROLES;
    
    this.ngxPermissionsService
    .hasPermission(this.editRolePermission)
    .then((result) => {
      this.haseditRolePermission = result;
    });

    this.ngxPermissionsService
    .hasPermission(this.createRolePermission)
    .then((result) => {
      this.hascreateRolePermission = result;
    });

    this.roles = this.route.snapshot.data['roles'];
    this.user = this.route.snapshot.data['user'];
    this.roleForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(this.haseditRolePermission && !this.hascreateRolePermission){
      this.isDisabledBtnSaveEdit = true;
      this.roleForm.controls['name'].disable();
    }
  }

  addRole() {
    if (this.roleForm.valid) {
      this.rolesPermissionsService
        .postRole(this.auth.readToken(), this.roleForm.value)
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
                this.roles = data['roles'].map((item) => {
                  return this.adapterRole.adapt(item);
                });
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Rol creado con éxito',
                });
                this.roleForm.reset();
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

  updateRole() {
    if (this.roleForm.valid) {
      this.rolesPermissionsService
        .putRole(this.auth.readToken(), this.idToUpdate, this.roleForm.value)
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
                this.roles = data['roles'].map((item) => {
                  return this.adapterRole.adapt(item);
                });
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Rol actualizado con éxito',
                });
                if(this.haseditRolePermission && !this.hascreateRolePermission){
                  this.isDisabledBtnSaveEdit = true;
                  this.roleForm.controls['name'].disable();
                }
                this.roleForm.reset();
                this.idToUpdate = -1;
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
    } else {
      Swal('There was an error', '', 'error');
      console.log('There was an error');
    }
  }

  editRole(role: any) {
    this.actionBtn = 'Actualizar';
    if(this.haseditRolePermission && !this.hascreateRolePermission){
      this.isDisabledBtnSaveEdit = false;
      this.roleForm.controls['name'].enable();
    }
    this.roleForm.controls['name'].setValue(role.name);
    this.idToUpdate = role.id;
  }

  deleteRole(id: number) {
    Swal({
      title: 'Realmente deseas eliminar este rol?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.rolesPermissionsService
          .deleteRole(this.auth.readToken(), id)
          .subscribe({
            next: (data) => {
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
                  text: 'Rol eliminado con éxito',
                });
                this.roles = this.roles.filter((item) => item.id != id);
                this.actionBtn = 'Guardar';
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
      } else if (result) {
      }
    });
  }
}
