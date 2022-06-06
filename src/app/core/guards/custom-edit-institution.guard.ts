import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditInstitutionGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditInstitution = true;
      const editInstitutionData = route.data['permissions'].editInstitution;

      const editInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionData,
          },
        },
      };

      const editInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionRequestData,
        state
      ) as Promise<boolean>;

      return editInstitutionGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
