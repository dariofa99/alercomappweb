import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AffectRangeModel } from '../../models/affectRangeModel';
import { AlertModel } from '../../models/alertModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';

@Component({
  selector: 'app-myalerts',
  templateUrl: './myalerts.component.html',
  styles: [
  ]
})
export class MyalertsComponent implements OnInit {

  alerts: AlertModel[] = [];
  alertDetails: AlertModel;
  isOnAlertDetails = false;
  isOnAlert = true;
  eventTypes: EventTypeModel[] = [];
  affectRanges: AffectRangeModel[] = [];
  mapType = 'satellite';

  constructor(private auth: AuthService, private alertService: AlertsService, private references: ReferencesService) {
   
  }

  ngOnInit(): void {
    this.alertService.getAlerts(this.auth.readToken()).subscribe((
      resp=>{
        //console.log(resp);
        this.alerts = resp;
      }
    ))

    this.alertService.getEventTypes(this.auth.readToken()).subscribe((
      resp=>{
        //console.log(resp);
        this.eventTypes = resp;
      }
    ))

    this.references.getAffectsRanges(this.auth.readToken()).subscribe((
      resp=>{
        //console.log(resp);
        this.affectRanges = resp;
      }
    ))
    
  }

  onEventTypeSelected(event: any){
    
  }

  onSeeDetails(alert: AlertModel){
    console.log(alert)
    this.alertDetails = alert;
    this.isOnAlertDetails = true;
    this.isOnAlert = false;
  }

  checkboxChanged(event: any){

  }

  backToList(){
    this.isOnAlertDetails = false;
    this.isOnAlert = true;
  }

  toFloat(value: string){
    return parseFloat(value);
  }

}
