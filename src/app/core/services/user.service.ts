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

  putUser(auth_token,id,userData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/users/`+id,userData,{headers: headers}
    );
  }

  postUser(auth_token,userData){
    const data = {
      ...userData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/users`,data,{headers: headers}
    );
  }

  deleteUser(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/users/`+id,{headers: headers}
    );
  }
  
}
