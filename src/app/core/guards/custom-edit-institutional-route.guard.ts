import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditInstitutionalRouteGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditInstitutionalRoute = true;
      const editInstitutionalRouteData = route.data['permissions'].editInstitutionalRoute;

      const editInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editInstitutionalRouteData,
          },
        },
      };

      const editInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        editInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;

      return editInstitutionalRouteGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
