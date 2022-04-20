import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel, UserAdapter } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://3.136.4.86/api/v1'

  constructor(private http: HttpClient, private adapterUser: UserAdapter) { }

  getUserMe(auth_token): Observable<UserModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/user/me`,{headers: headers}
    ).pipe(
      map((item) => {
        //console.log(item['user'])
        return this.adapterUser.adapt(item['user'])
      })
    );
  }

  getUsers(auth_token): Observable<UserModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/users`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['user'].map((item) => {
        //console.log(data)
        return this.adapterUser.adapt(item)
      })) 
    );
  }

  
}
