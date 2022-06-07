import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InstitutionsAdapter, InstitutionsModel } from '../models/institutionsModel';
import { InstitutionsEditAdapter, InstitutionsEditModel } from '../models/institutionsEditModel';
import { environment } from 'src/environments/environment';
import { InstitutionsInfoAdapter, InstitutionsInfoModel } from '../models/institutionsInfoModel';
import { InstitutionsInfoEditAdapter } from '../models/institutionsInfoEditModel';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterInstitution: InstitutionsAdapter,
    private adapterEditInstitution: InstitutionsEditAdapter, private adapterInstitutionsInfo: InstitutionsInfoAdapter,
    private adapterEditInstitutionInfo: InstitutionsInfoEditAdapter) { }

  getInstitutionById(auth_token,id): Observable<InstitutionsEditModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutions/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        return this.adapterEditInstitution.adapt(item)
      })
    )
  }

  getInstitutionInfoById(auth_token,id): Observable<InstitutionsInfoModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutions/information/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        return this.adapterEditInstitutionInfo.adapt(item)
      })
    )
  }

  getInstitutions(auth_token): Observable<InstitutionsModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutions`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['institutions'].map((item) => {
        return this.adapterInstitution.adapt(item)
      })) 
    );
  }

  getInstitutionsInfo(auth_token): Observable<InstitutionsInfoModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`,
      'Access-Control-Allow-Origin': '*'
    });
    
    return this.http.get(
      `${ this.url }/institutions/information`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['institutions'].map((item) => {
        return this.adapterInstitutionsInfo.adapt(item)
      })) 
    );
  }

  putInstitution(auth_token,id,institutionData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/institutions/`+id,institutionData,{headers: headers}
    );
  }

  postInstitution(auth_token,institutionData){
    const data = {
      ...institutionData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/institutions`,data,{headers: headers}
    );
  }

  deleteInstitution(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/institutions/`+id,{headers: headers}
    );
  }
}
