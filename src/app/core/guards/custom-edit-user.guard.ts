import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditUserGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditUser = true;
      const editUserData = route.data['permissions'].editUser;

      const editUserRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editUserData,
          },
        },
      };

      const editUserGuard = this.ngxPermissionsGuard.canActivate(
        editUserRequestData,
        state
      ) as Promise<boolean>;

      return editUserGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
      
  }
  
}
