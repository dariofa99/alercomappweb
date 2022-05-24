import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventTypeAdapter, EventTypeModel } from '../models/eventTypeModel';

@Injectable({
  providedIn: 'root'
})
export class EventypesService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterEventType: EventTypeAdapter) { }

  getEventTypeById(auth_token,id): Observable<EventTypeModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/event/types/`+id+`/edit`,{headers: headers}
    ).pipe(
      map((item) => {
        return this.adapterEventType.adapt(item['event_type']);
      })
    )
  }

  getEventTypes(auth_token): Observable<EventTypeModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/event/types`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['event_types'].map((item) => {
        return this.adapterEventType.adapt(item)
      })) 
    );
  }

  putEventType(auth_token,id,eventTypeData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/event/types/`+id,eventTypeData,{headers: headers}
    );
  }

  postEventType(auth_token,eventTypeData){
    const data = {
      ...eventTypeData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/event/types`,data,{headers: headers}
    );
  }

  deleteEventType(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/event/types/`+id,{headers: headers}
    );
  }
}
