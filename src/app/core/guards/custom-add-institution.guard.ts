import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAddInstitutionGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let activeCreateInstitution = true;
      const createInstitutionData = route.data['permissions'].createInstitution;

      const createInstitutionRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createInstitutionData,
          },
        },
      };

      const createInstitutionGuard = this.ngxPermissionsGuard.canActivate(
        createInstitutionRequestData,
        state
      ) as Promise<boolean>;

      return createInstitutionGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
  
}
