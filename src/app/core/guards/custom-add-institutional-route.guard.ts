import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddInstitutionalRouteGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitutionalRoute = true;
      const createInstitutionalRouteData = route.data['permissions'].createInstitutionalRoute;

      const createInstitutionalRouteRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionalRouteData,
          },
        },
      };

      const createInstitutionalRouteGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionalRouteRequestData,
        state
      ) as Promise<boolean>;

      return createInstitutionalRouteGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
