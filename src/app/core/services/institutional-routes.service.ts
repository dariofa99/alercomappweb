import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InstitutionalRoutesAdapter, InstitutionalRoutesModel } from '../models/institutionalroutesModel';

@Injectable({
  providedIn: 'root'
})
export class InstitutionalRoutesService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterInstitutionalRoutes: InstitutionalRoutesAdapter) { }

  getInstitutionalRouteById(auth_token,id): Observable<InstitutionalRoutesModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutional/routes/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        return this.adapterInstitutionalRoutes.adapt(item['institutional_route'])
      })
    )
  }

  getInstitutionalRoutes(auth_token): Observable<InstitutionalRoutesModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/institutional/routes`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['institutional_routes'].map((item) => {
        return this.adapterInstitutionalRoutes.adapt(item)
      })) 
    );
  }

  putInstitutionalRoute(auth_token,id,institutionalRouteData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/institutional/routes/`+id,institutionalRouteData,{headers: headers}
    );
  }

  postInstitutionalRoute(auth_token,institutionalRouteData){
    const data = {
      ...institutionalRouteData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/institutional/routes`,data,{headers: headers}
    );
  }

  deleteInstitutionalRoute(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/institutional/routes/`+id,{headers: headers}
    );
  }}
