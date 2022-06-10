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
      
    let activeEditEvent = true;
    let activeDeleteEvent = true;
    let activeReadEvent = true;
    let activeChangeStateEvent = true;
    const readEventData = route.data['permissions'].readEvent;
    const editEventData = route.data['permissions'].editEvent;
    const deleteEventData = route.data['permissions'].deleteEvent;
    const changeStateEventData = route.data['permissions'].changeStateEvent;

    const readEventRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: readEventData,
        },
      },
    };

    const editEventRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: editEventData,
        },
      },
    };

    const deleteEventRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: deleteEventData,
        },
      },
    };

    const changeStateEventRequestData: any = {
      ...route,
      data: {
        permissions: {
          only: changeStateEventData,
        },
      },
    };

    const readEventGuard = this.ngxPermissionsGuard.canActivate(
      readEventRequestData,
      state
    ) as Promise<boolean>;
    const editEventGuard = this.ngxPermissionsGuard.canActivate(
      editEventRequestData,
      state
    ) as Promise<boolean>;
    const deleteEventGuard = this.ngxPermissionsGuard.canActivate(
      deleteEventRequestData,
      state
    ) as Promise<boolean>;
    const changeStateGuard = this.ngxPermissionsGuard.canActivate(
      changeStateEventRequestData,
      state
    ) as Promise<boolean>;

    return editEventGuard
      .then((data) => {
        if (!data) {
          activeEditEvent = false;
        }
        return deleteEventGuard;
      })
      .then((data) => {
        if (!data) {
          activeDeleteEvent = false;
        }

        return readEventGuard;
      }).then((data) => {
        if (!data) {
          activeReadEvent = false;
        }

        return changeStateGuard;
      }).then((data) => {
        if (!data) {
          activeChangeStateEvent = false;
        }

        if (!activeEditEvent && !activeDeleteEvent && !activeReadEvent && !activeChangeStateEvent) {
          this.router.navigate(['forbidden']);
          return Promise.reject();
        }

        return true;
      });      
  }
  
}
