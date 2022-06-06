import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomAddUserGuard implements CanActivate {
  constructor(
    private ngxPermissionsGuard: NgxPermissionsGuard,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      let activeCreateUser = true;
      const createUserData = route.data['permissions'].createUser;

      const createUserRequestData: any = {
        ...route,
        data: {
          permissions: {
            only: createUserData,
          },
        },
      };

      const createUserGuard = this.ngxPermissionsGuard.canActivate(
        createUserRequestData,
        state
      ) as Promise<boolean>;

      return createUserGuard
      .then((data) => {
        if (!data) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }
        return true;
      });
  }
}
