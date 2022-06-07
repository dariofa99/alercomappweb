import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddEditRoleGuard implements CanActivate {
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
      const readRoleData = route.data['permissions'].readRole;
      const createRoleData = route.data['permissions'].createRole;
      const editRoleData = route.data['permissions'].editRole;
      const deleteRoleData = route.data['permissions'].deleteRole;
  
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
          if (!activeCreateRole && !activeEditRole && !activeDeleteRole && !activeReadRole) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
          return true;
        });
          
  }
  
}
