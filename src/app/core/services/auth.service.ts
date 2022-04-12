import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/userModel';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://3.136.4.86/api/v1'

  userToken: string;

  constructor( private http: HttpClient ) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login( user: UserModel ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/login`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['access_token'] );
        return resp;
      })
    );

  }

  newUser( user: UserModel ) {

    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/register`,
      authData
    ).pipe(
      map( resp => {
        this.saveToken( resp['acces_token'] );
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

}
