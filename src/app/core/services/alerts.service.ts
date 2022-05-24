import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertEditAdapter, AlertEditModel } from '../models/alertEditModel';
import { AlertAdapter, AlertModel } from '../models/alertModel';
import { EventTypeAdapter, EventTypeModel } from '../models/eventTypeModel';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private http: HttpClient, private adapterEditAlert: AlertEditAdapter, private adapterAlert: AlertAdapter, private adapterEventType: EventTypeAdapter) { }

  private url = environment.apiUrl;

  getAlertById(auth_token,id): Observable<AlertEditModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/events/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        console.log(item);
        return this.adapterEditAlert.adapt(item['event'])
      })
    )
  }


  getAlerts(auth_token): Observable<AlertModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/events`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['events'].map((item) => {
        return this.adapterAlert.adapt(item)
      })) 
    );
  }

  getAlertsMe(auth_token): Observable<AlertModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    let params = new HttpParams().append("data","my");
    
    return this.http.get(
      `${ this.url }/events`,{headers: headers,params: params}
    ).pipe(
      map((data: any[])=> data['events'].map((item) => {
        console.log(data)
        return this.adapterAlert.adapt(item)
      })) 
    );
  }

  postEvent(auth_token,eventData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/events`,eventData,{headers: headers}
    );
  }

  postUpdateEvent(auth_token,id,eventData){

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/events/`+id,eventData,{headers: headers}
    );
  }

}
