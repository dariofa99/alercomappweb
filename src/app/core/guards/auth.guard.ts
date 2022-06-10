import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { LoadPermissionsService } from '../services/load-permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthService,
               private router: Router/* , private loadPermissionsService: LoadPermissionsService, private ngxPermissionsService: NgxPermissionsService */) {}

  canActivate(route: ActivatedRouteSnapshot)  {
    if ( this.auth.isAuthenticated() ) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
