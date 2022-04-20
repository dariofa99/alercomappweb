import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionsAdapter, PermissionsModel } from '../models/permissionsModel';
import { RoleModel, RoleAdapter } from '../models/roleModel';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {

  private url = 'http://3.136.4.86/api/v1'

  constructor(private http: HttpClient, private adapterRole: RoleAdapter, private adapterPermission: PermissionsAdapter) { }

  getRoles(auth_token): Observable<RoleModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/admin/roles`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['roles'].map((item) => {
        //console.log(data)
        return this.adapterRole.adapt(item)
      })) 
    );
  }

  getPermissions(auth_token): Observable<PermissionsModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/admin/roles`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['permissions'].map((item) => {
        //console.log(data)
        return this.adapterPermission.adapt(item)
      })) 
    );
  }
}
