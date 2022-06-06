import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminInstitutionsInfoGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitutionInfo = true;
      let activeEditInstitutionInfo = true;
      let activeDeleteInstitutionInfo = true;
      let activeReadInstitutionInfo = true;
      const readInstitutionInfoData = route.data['permissions'].readInstitutionInfo;
      const createInstitutionInfoData = route.data['permissions'].createInstitutionInfo;
      const editInstitutionInfoData = route.data['permissions'].editInstitutionInfo;
      const deleteInstitutionInfoData = route.data['permissions'].deleteInstitutionInfo;
  
      const readInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readInstitutionInfoData,
          },
        },
      };
  
      const createInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionInfoData,
          },
        },
      };
  
      const editInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionInfoData,
          },
        },
      };
  
      const deleteInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteInstitutionInfoData,
          },
        },
      };
  
      const readInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        readInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;
      const createInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;
      const editInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;
      const deleteInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        deleteInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;
  
      return createInstitutionInfoGuard
        .then((data) => {
          if (!data) {
            activeCreateInstitutionInfo = false;
          }
          return editInstitutionInfoGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditInstitutionInfo = false;
          }
          return deleteInstitutionInfoGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteInstitutionInfo = false;
          }
  
          return readInstitutionInfoGuard;
        }).then((data) => {
          if (!data) {
            activeReadInstitutionInfo = false;
          }
  
          if (!activeCreateInstitutionInfo && !activeEditInstitutionInfo && !activeDeleteInstitutionInfo && !activeReadInstitutionInfo) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
  
          return true;
        });
  }
  
}
