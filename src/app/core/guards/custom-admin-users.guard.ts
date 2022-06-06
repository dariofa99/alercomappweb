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
export class CustomAdminUsersGuard implements CanActivate {
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
    let activeEditUser = true;
    let activeDeleteUser = true;
    let activeReadUser = true;
    const readUserData = route.data['permissions'].readUser;
    const createUserData = route.data['permissions'].createUser;
    const editUserData = route.data['permissions'].editUser;
    const deleteUserData = route.data['permissions'].deleteUser;

    const readUserRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: readUserData,
        },
      },
    };

    const createUserRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: createUserData,
        },
      },
    };

    const editUserRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: editUserData,
        },
      },
    };

    const deleteUserRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: deleteUserData,
        },
      },
    };

    const readUserGuard = this.ngxPermissionsGuard.canActivate(
      readUserRequestData,
      state
    ) as Promise<boolean>;
    const createUserGuard = this.ngxPermissionsGuard.canActivate(
      createUserRequestData,
      state
    ) as Promise<boolean>;
    const editUserGuard = this.ngxPermissionsGuard.canActivate(
      editUserRequestData,
      state
    ) as Promise<boolean>;
    const deleteUserGuard = this.ngxPermissionsGuard.canActivate(
      deleteUserRequestData,
      state
    ) as Promise<boolean>;

    return createUserGuard
      .then((data) => {
        if (!data) {
          activeCreateUser = false;
        }
        return editUserGuard;
      })
      .then((data) => {
        if (!data) {
          activeEditUser = false;
        }
        return deleteUserGuard;
      })
      .then((data) => {
        if (!data) {
          activeDeleteUser = false;
        }

        return readUserGuard;
      }).then((data) => {
        if (!data) {
          activeReadUser = false;
        }

        if (!activeCreateUser && !activeEditUser && !activeDeleteUser && !activeReadUser) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }

        return true;
      });
  }
}
