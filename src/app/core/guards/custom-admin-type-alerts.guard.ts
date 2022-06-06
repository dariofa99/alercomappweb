import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminTypeAlertsGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateTypeAlert = true;
      let activeEditTypeAlert = true;
      let activeDeleteTypeAlert = true;
      let activeReadTypeAlert = true;
      const readTypeAlertData = route.data['permissions'].readTypeAlert;
      const createTypeAlertData = route.data['permissions'].createTypeAlert;
      const editTypeAlertData = route.data['permissions'].editTypeAlert;
      const deleteTypeAlertData = route.data['permissions'].deleteTypeAlert;
  
      const readTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readTypeAlertData,
          },
        },
      };
  
      const createTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createTypeAlertData,
          },
        },
      };
  
      const editTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editTypeAlertData,
          },
        },
      };
  
      const deleteTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteTypeAlertData,
          },
        },
      };
  
      const readTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        readTypeAlertRequestData,
        state
      ) as Promise<boolean>;
      const createTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        createTypeAlertRequestData,
        state
      ) as Promise<boolean>;
      const editTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        editTypeAlertRequestData,
        state
      ) as Promise<boolean>;
      const deleteTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        deleteTypeAlertRequestData,
        state
      ) as Promise<boolean>;
  
      return createTypeAlertGuard
        .then((data) => {
          if (!data) {
            activeCreateTypeAlert = false;
          }
          return editTypeAlertGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditTypeAlert = false;
          }
          return deleteTypeAlertGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteTypeAlert = false;
          }
  
          return readTypeAlertGuard;
        }).then((data) => {
          if (!data) {
            activeReadTypeAlert = false;
          }
  
          if (!activeCreateTypeAlert && !activeEditTypeAlert && !activeDeleteTypeAlert && !activeReadTypeAlert) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
  
          return true;
        });
  }
  
}
