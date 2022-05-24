import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InstitutionsAdapter, InstitutionsModel } from '../models/institutionsModel';
import { InstitutionsEditAdapter, InstitutionsEditModel } from '../models/institutionsEditModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterInstitution: InstitutionsAdapter,
    private adapterEditInstitution: InstitutionsEditAdapter) { }

  getInstitutionById(auth_token,id): Observable<InstitutionsEditModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutions/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        //console.log(item['institution'])
        return this.adapterEditInstitution.adapt(item)
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
        //console.log(data)
        return this.adapterInstitution.adapt(item)
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
