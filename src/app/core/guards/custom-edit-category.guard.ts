import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomEditCategoryGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeEditCategory = true;
      const editCategoryData = route.data['permissions'].editCategory;

      const editCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editCategoryData,
          },
        },
      };

      const editCategoryGuard = this.ngxPermissionsGuard.canActivate(
        editCategoryRequestData,
        state
      ) as Promise<boolean>;

      return editCategoryGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
