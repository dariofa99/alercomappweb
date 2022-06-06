import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditInstitutionInfoGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditInstitutionInfo = true;
      const editInstitutionInfoData = route.data['permissions'].editInstitutionInfo;

      const editInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionInfoData,
          },
        },
      };

      const editInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;

      return editInstitutionInfoGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
