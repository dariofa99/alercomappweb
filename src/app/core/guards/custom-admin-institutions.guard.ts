import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminInstitutionsGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitution = true;
      let activeEditInstitution = true;
      let activeDeleteInstitution = true;
      let activeReadInstitution = true;
      const readInstitutionData = route.data['permissions'].readInstitution;
      const createInstitutionData = route.data['permissions'].createInstitution;
      const editInstitutionData = route.data['permissions'].editInstitution;
      const deleteInstitutionData = route.data['permissions'].deleteInstitution;
  
      const readInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readInstitutionData,
          },
        },
      };
  
      const createInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionData,
          },
        },
      };
  
      const editInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionData,
          },
        },
      };
  
      const deleteInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteInstitutionData,
          },
        },
      };
  
      const readInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        readInstitutionRequestData,
        state
      ) as Promise<boolean>;
      const createInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionRequestData,
        state
      ) as Promise<boolean>;
      const editInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionRequestData,
        state
      ) as Promise<boolean>;
      const deleteInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        deleteInstitutionRequestData,
        state
      ) as Promise<boolean>;
  
      return createInstitutionGuard
        .then((data) => {
          if (!data) {
            activeCreateInstitution = false;
          }
          return editInstitutionGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditInstitution = false;
          }
          return deleteInstitutionGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteInstitution = false;
          }
  
          return readInstitutionGuard;
        }).then((data) => {
          if (!data) {
            activeReadInstitution = false;
          }
  
          if (!activeCreateInstitution && !activeEditInstitution && !activeDeleteInstitution && !activeReadInstitution) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
  
          return true;
        });
  }
  
}
