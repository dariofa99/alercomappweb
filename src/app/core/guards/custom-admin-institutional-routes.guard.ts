import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminInstitutionalRoutesGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitutionalRoute = true;
      let activeEditInstitutionalRoute = true;
      let activeDeleteInstitutionalRoute = true;
      let activeReadInstitutionalRoute = true;
      const readInstitutionalRouteData = route.data['permissions'].readInstitutionalRoute;
      const createInstitutionalRouteData = route.data['permissions'].createInstitutionalRoute;
      const editInstitutionalRouteData = route.data['permissions'].editInstitutionalRoute;
      const deleteInstitutionalRouteData = route.data['permissions'].deleteInstitutionalRoute;
  
      const readInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readInstitutionalRouteData,
          },
        },
      };
  
      const createInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionalRouteData,
          },
        },
      };
  
      const editInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionalRouteData,
          },
        },
      };
  
      const deleteInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteInstitutionalRouteData,
          },
        },
      };
  
      const readInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        readInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;
      const createInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;
      const editInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;
      const deleteInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        deleteInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;
  
      return createInstitutionalRouteGuard
        .then((data) => {
          if (!data) {
            activeCreateInstitutionalRoute = false;
          }
          return editInstitutionalRouteGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditInstitutionalRoute = false;
          }
          return deleteInstitutionalRouteGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteInstitutionalRoute = false;
          }
  
          return readInstitutionalRouteGuard;
        }).then((data) => {
          if (!data) {
            activeReadInstitutionalRoute = false;
          }
  
          if (!activeCreateInstitutionalRoute && !activeEditInstitutionalRoute && !activeDeleteInstitutionalRoute && !activeReadInstitutionalRoute) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
  
          return true;
        });
  }
  
}
