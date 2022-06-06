import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAdminCategoriesGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateCategory = true;
      let activeEditCategory = true;
      let activeDeleteCategory = true;
      let activeReadCategory = true;
      const readCategoryData = route.data['permissions'].readCategory;
      const createCategoryData = route.data['permissions'].createCategory;
      const editCategoryData = route.data['permissions'].editCategory;
      const deleteCategoryData = route.data['permissions'].deleteCategory;
  
      const readCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: readCategoryData,
          },
        },
      };
  
      const createCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createCategoryData,
          },
        },
      };
  
      const editCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: editCategoryData,
          },
        },
      };
  
      const deleteCategoryRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: deleteCategoryData,
          },
        },
      };
  
      const readCategoryGuard = this.ngxPermissionsGuard.canActivate(
        readCategoryRequestData,
        state
      ) as Promise<boolean>;
      const createCategoryGuard = this.ngxPermissionsGuard.canActivate(
        createCategoryRequestData,
        state
      ) as Promise<boolean>;
      const editCategoryGuard = this.ngxPermissionsGuard.canActivate(
        editCategoryRequestData,
        state
      ) as Promise<boolean>;
      const deleteCategoryGuard = this.ngxPermissionsGuard.canActivate(
        deleteCategoryRequestData,
        state
      ) as Promise<boolean>;
  
      return createCategoryGuard
        .then((data) => {
          if (!data) {
            activeCreateCategory = false;
          }
          return editCategoryGuard;
        })
        .then((data) => {
          if (!data) {
            activeEditCategory = false;
          }
          return deleteCategoryGuard;
        })
        .then((data) => {
          if (!data) {
            activeDeleteCategory = false;
          }
  
          return readCategoryGuard;
        }).then((data) => {
          if (!data) {
            activeReadCategory = false;
          }
  
          if (!activeCreateCategory && !activeEditCategory && !activeDeleteCategory && !activeReadCategory) {
            this.router.navigate(['forbidden']);
            return Promise.reject();
          }
  
          return true;
        });
  }
  
}
