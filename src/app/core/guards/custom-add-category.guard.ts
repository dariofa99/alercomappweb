import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddCategoryGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateCategory = true;
      const createCategoryData = route.data['permissions'].createCategory;

      const createCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createCategoryData,
          },
        },
      };

      const createCategoryGuard = this.ngxPermissionsGuard.canActivate(
        createCategoryRequestData,
        state
      ) as Promise<boolean>;

      return createCategoryGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
