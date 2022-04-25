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

  putRole(auth_token,id,roleData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/admin/role/`+id,roleData,{headers: headers}
    );
  }

  postRole(auth_token,roleData){
    const data = {
      ...roleData
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/admin/role`,data,{headers: headers}
    );
  }

  deleteRole(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/admin/role/`+id,{headers: headers}
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

  putPermission(auth_token,id,permissionData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/admin/permission/`+id,permissionData,{headers: headers}
    );
  }

  postPermission(auth_token,permissionData){
    const data = {
      ...permissionData
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/admin/permission`,data,{headers: headers}
    );
  }

  deletePermission(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/admin/permission/`+id,{headers: headers}
    );
  }

  sync_rol_permission(auth_token,role_id,permission_id,ismethod){
    const data = {
      role_id,
      permission_id,
      ismethod
    };
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.post(
      `${ this.url }/admin/sync/rol/permissions`,data,{headers: headers}
    );
  }
}
