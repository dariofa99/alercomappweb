import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiUrl;

  userToken: string = "";

  constructor( private http: HttpClient, private route: Router ) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('permissions');
    this.route.navigateByUrl("login");
  }

  login( userData ) {

    const authData = {
      ...userData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post(
      `${ this.url }/login`,
      authData,{headers: headers}
    ).pipe(
      map( resp => {
        this.saveToken( resp['access_token'] );
        this.savePermissions(resp['permissions']);
        return resp;
      })
    );

  }

  newUser( userData ) {

    const authData = {
      ...userData,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/register`,
      authData
    ).pipe(
      map( resp => {
        return resp;
      })
    );

  }

  private saveToken( access_token: string ) {

    this.userToken = access_token;
    localStorage.setItem('token', access_token);

    let now = new Date();
    now.setSeconds( 3600 );

    localStorage.setItem('expire', now.getTime().toString() );


  }

  private savePermissions( permissions: [] ) {
    localStorage.setItem('permissions', JSON.stringify(permissions));

  }

  readToken() {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }

  isAuthenticated(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if ( expireDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

  confirmAccount( token ) {

    return this.http.post(
      `${ this.url }/confirm/account`,token
    ).pipe(
      map( resp => {
        return resp;
      })
    );

  }

  forgot( forgotData ) {

    return this.http.post(
      `${ this.url }/reset/password/mail`,forgotData
    ).pipe(
      map( resp => {
        return resp;
      })
    );

  }

  recoveryPassword( recoveryPasswordData ) {

    return this.http.post(
      `${ this.url }/reset/password`,recoveryPasswordData
    ).pipe(
      map( resp => {
        return resp;
      })
    );

  }

}
