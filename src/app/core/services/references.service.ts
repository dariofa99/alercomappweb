import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AffectRangeAdapter, AffectRangeModel } from '../models/affectRangeModel';
import { DepartmentAdapter, DepartmentModel } from '../models/departmentModel';
import { TownAdapter, TownModel } from '../models/townModel';

@Injectable({
  providedIn: 'root'
})
export class ReferencesService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterTown: TownAdapter,
    private adapterDepartment: DepartmentAdapter, private adapterAffectRange: AffectRangeAdapter) { }

  getTowns(auth_token,deparment_id): Observable<TownModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/towns/`+`${ deparment_id }`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['towns'].map((item) => {
        //console.log(data)
        return this.adapterTown.adapt(item)
      })) 
    );
  }

  getTownsList(auth_token){
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/towns`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['towns'].map((item) => {
        return this.adapterTown.adapt(item)
      })) 
    );
  }

  getDepartments(auth_token): Observable<DepartmentModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/departments`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['references'].map((item) => {
        //console.log(data)
        return this.adapterDepartment.adapt(item)
      })) 
    );
  }

  getAffectsRanges(auth_token): Observable<AffectRangeModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/affects/range`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['references'].map((item) => {
        //console.log(data)
        return this.adapterAffectRange.adapt(item)
      })) 
    );
  }

}
