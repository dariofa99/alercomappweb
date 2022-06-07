import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddEditPermissionGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreatePermission = true;
      let activeEditPermission = true;
      let activeDeletePermission = true;
      let activeReadPermission = true;
      const readPermissionData = route.data['permissions'].readPermission;
      const createPermissionData = route.data['permissions'].createPermission;
      const editPermissionData = route.data['permissions'].editPermission;
      const deletePermissionData = route.data['permissions'].deletePermission;
  
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
  
      return readPermissionGuard
        .then((data) => {
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
          if (!activeCreatePermission && !activeEditPermission && !activeDeletePermission && !activeReadPermission) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
          return true;
        });
    }
  
}
