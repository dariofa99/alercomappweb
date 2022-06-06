import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminRolesGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateRole = true;
      let activeEditRole = true;
      let activeDeleteRole = true;
      let activeReadRole = true;
      let activeCreatePermission = true;
      let activeEditPermission = true;
      let activeDeletePermission = true;
      let activeReadPermission = true;
      const readRoleData = route.data['permissions'].readRole;
      const createRoleData = route.data['permissions'].createRole;
      const editRoleData = route.data['permissions'].editRole;
      const deleteRoleData = route.data['permissions'].deleteRole;
      const readPermissionData = route.data['permissions'].readPermission;
      const createPermissionData = route.data['permissions'].createPermission;
      const editPermissionData = route.data['permissions'].editPermission;
      const deletePermissionData = route.data['permissions'].deletePermission;
  
      const readRoleRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readRoleData,
          },
        },
      };
  
      const createRoleRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createRoleData,
          },
        },
      };
  
      const editRoleRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editRoleData,
          },
        },
      };
  
      const deleteRoleRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteRoleData,
          },
        },
      };

      const readPermissionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readPermissionData,
          },
        },
      };
  
      const createPermissionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createPermissionData,
          },
        },
      };
  
      const editPermissionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editPermissionData,
          },
        },
      };
  
      const deletePermissionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deletePermissionData,
          },
        },
      };
  
      const readRoleGuard = this.ngxPermissionsGuard.canActivate(
        readRoleRequestData,
        state
      ) as Promise<boolean>;
      const createRoleGuard = this.ngxPermissionsGuard.canActivate(
        createRoleRequestData,
        state
      ) as Promise<boolean>;
      const editRoleGuard = this.ngxPermissionsGuard.canActivate(
        editRoleRequestData,
        state
      ) as Promise<boolean>;
      const deleteRoleGuard = this.ngxPermissionsGuard.canActivate(
        deleteRoleRequestData,
        state
      ) as Promise<boolean>;

      const readPermissionGuard = this.ngxPermissionsGuard.canActivate(
        readPermissionRequestData,
        state
      ) as Promise<boolean>;
      const createPermissionGuard = this.ngxPermissionsGuard.canActivate(
        createPermissionRequestData,
        state
      ) as Promise<boolean>;
      const editPermissionGuard = this.ngxPermissionsGuard.canActivate(
        editPermissionRequestData,
        state
      ) as Promise<boolean>;
      const deletePermissionGuard = this.ngxPermissionsGuard.canActivate(
        deletePermissionRequestData,
        state
      ) as Promise<boolean>;
  
      return createRoleGuard
        .then((data) => {
          if (!data) {
            activeCreateRole = false;
          }
          return editRoleGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditRole = false;
          }
          return deleteRoleGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteRole = false;
          }
  
          return readRoleGuard;
        }).then((data) => {
          if (!data) {
            activeReadRole = false;
          }
          return readPermissionGuard;
        }).then((data) => {
          if (!data) {
            activeReadPermission = false;
          }
  
          return createPermissionGuard;
        }).then((data) => {
          if (!data) {
            activeCreatePermission = false;
          }
  
          return editPermissionGuard;
        }).then((data) => {
          if (!data) {
            activeEditPermission = false;
          }
  
          return deletePermissionGuard;
        }).then((data) => {
          if (!data) {
            activeDeletePermission = false;
          }
          if (!activeCreateRole && !activeEditRole && !activeDeleteRole && !activeReadRole && !activeCreatePermission && !activeEditPermission && !activeDeletePermission && !activeReadPermission) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
          return true;
        });
  }
  
}
