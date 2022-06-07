import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PermissionsModel } from '../../models/permissionsModel';
import { RoleModel } from '../../models/roleModel';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../models/userModel';
import { ToastrService } from 'ngx-toastr';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';

export class PermissionsChecked {
  constructor(
    public id?: string,
    public guard_name?: number,
    public name?: string,
    public checked?: boolean
  ) {}
}

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styles: [],
})
export class RolesPermissionsComponent implements OnInit, AfterViewInit {
  header = [];
  RowsData = [];
  permissionsAux: PermissionsModel[] = [];
  permissionsAuxNew: PermissionsModel[] = [];
  rolesDisplay: RoleModel[] = [];
  roles: RoleModel[];
  permissions: PermissionsModel[];
  checked = false;
  user: UserModel;
  createEditRolePermission = [];
  readRolePermission;
  createRolePermission;
  editRolePermission;
  deleteRolePermission;
  readPermissionPermission;
  createPermissionPermission;
  editPermissionPermission;
  deletePermissionPermission;
  assign_role;

  constructor(
    private auth: AuthService,
    private rolesPermissionsService: RolesPermissionsService,
    private route: ActivatedRoute,
    public router: Router,
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
    this.createRolePermission = this.permissionsList.CREAR_ROLES ;
    this.editRolePermission = this.permissionsList.EDITAR_ROLES;
    this.deleteRolePermission = this.permissionsList.ELIMINAR_ROLES;
    this.readPermissionPermission = this.permissionsList.VER_PERMISOS;
    this.createPermissionPermission = this.permissionsList.CREAR_PERMISOS;
    this.editPermissionPermission = this.permissionsList.EDITAR_PERMISOS ;
    this.deletePermissionPermission = this.permissionsList.ELIMINAR_PERMISOS;
    this.assign_role = this.permissionsList.ASIGNAR_ROL;

    this.roles = this.route.snapshot.data['roles'];
    this.permissions = this.route.snapshot.data['permissions'];
    this.user = this.route.snapshot.data['user'];
  }

  ngOnInit(): void {
    this.permissions.forEach((element) => {
      this.permissionsAux.push(element);
    });
    for (let i = 0; i < this.permissions.length; i++) {
      this.permissionsAux.push(
        new PermissionsChecked('', 0, this.permissions[i].name, false)
      );
    }
    this.rolesDisplay.push(new RoleModel(0, '', '', this.permissionsAux));

    this.header.push('');
    this.roles.forEach((element) => {
      this.header.push(element.name);
      element.permissions.sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
      });

      this.permissionsAuxNew = [];

      let i = 0;

      this.permissionsAux.forEach((elementPermissionsAux) => {
        element.permissions.forEach((elementPermissions) => {
          if (elementPermissionsAux.id == elementPermissions.id) {
            this.permissionsAuxNew.push(
              new PermissionsChecked(
                elementPermissions.id,
                elementPermissions.guard_name,
                elementPermissions.name,
                true
              )
            );
          }
        });
      });

      let exists = false;
      this.permissions.forEach((element) => {
        this.permissionsAuxNew.forEach((elementInside) => {
          if (element.id == elementInside.id) {
            exists = true;
          }
        });
        if (!exists) {
          this.permissionsAuxNew.push(
            new PermissionsChecked(
              element.id,
              element.guard_name,
              element.name,
              false
            )
          );
        }
        exists = false;
      });

      this.permissionsAuxNew.sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
      });

      this.rolesDisplay.push(
        new RoleModel(
          element.id,
          element.guard_name,
          element.name,
          this.permissionsAuxNew
        )
      );
    });
  }

  ngOnDestroy(): void {}

  ngAfterViewInit() {}

  checkBoxChanged(event: any) {
    const dataToUpdate = event.target.value.split(',');
    if (dataToUpdate[2] == 'false' && event.target.checked == true) {
      this.rolesPermissionsService
        .sync_rol_permission(
          this.auth.readToken(),
          dataToUpdate[0],
          dataToUpdate[1],
          'insert'
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
              this.toastr.success('Permiso asociado con éxito');
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
      this.rolesPermissionsService
        .sync_rol_permission(
          this.auth.readToken(),
          dataToUpdate[0],
          dataToUpdate[1],
          'delete'
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
              this.toastr.success('Permiso eliminado con éxito');
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

  addPermission() {
    this.router.navigate(['/home/admin-roles/add-edit-permission']);
  }

  addRole() {
    this.router.navigate(['home/admin-roles/add-edit-rol']);
  }
}
