import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminAlertsGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const changeStateEventData = route.data['permissions'].changeStateEvent;

      const changeStateEventRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: changeStateEventData,
          },
        },
      };

      const changeStateGuard = this.ngxPermissionsGuard.canActivate(
        changeStateEventRequestData,
        state
      ) as Promise<boolean>;

      return changeStateGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
