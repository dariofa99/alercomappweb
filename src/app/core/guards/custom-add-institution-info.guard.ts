import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddInstitutionInfoGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitutionInfo = true;
      const createInstitutionInfoData = route.data['permissions'].createInstitutionInfo;

      const createInstitutionInfoRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionInfoData,
          },
        },
      };

      const createInstitutionInfoGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionInfoRequestData,
        state
      ) as Promise<boolean>;

      return createInstitutionInfoGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
