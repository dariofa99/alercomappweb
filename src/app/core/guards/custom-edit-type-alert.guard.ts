import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditTypeAlertGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditTypeAlert = true;
      const editTypeAlertData = route.data['permissions'].editTypeAlert;

      const editTypeAlertRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editTypeAlertData,
          },
        },
      };

      const editTypeAlertGuard = this.ngxPermissionsGuard.canActivate(
        editTypeAlertRequestData,
        state
      ) as Promise<boolean>;

      return editTypeAlertGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
