import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddTypeAlertGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateTypeAlert = true;
      const createTypeAlertData = route.data['permissions'].createTypeAlert;

      const createTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createTypeAlertData,
          },
        },
      };

      const createTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        createTypeAlertRequestData,
        state
      ) as Promise<boolean>;

      return createTypeAlertGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
