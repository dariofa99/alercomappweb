import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertAdapter, AlertModel } from '../models/alertModel';
import { EventTypeAdapter, EventTypeModel } from '../models/eventTypeModel';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private http: HttpClient, private adapterAlert: AlertAdapter, private adapterEventType: EventTypeAdapter) { }

  private url = 'http://3.136.4.86/api/v1'

  getAlerts(auth_token): Observable<AlertModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/events`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['events'].map((item) => {
        //console.log(data)
        return this.adapterAlert.adapt(item)
      })) 
    );
  }

  getEventTypes(auth_token): Observable<EventTypeModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/event/types`,{headers: headers}
    ).pipe(
      map((data: any[])=> data.map((item) => {
        //console.log(data)
        return this.adapterEventType.adapt(item)
      })) 
    );
  }
}
