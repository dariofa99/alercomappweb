import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AffectRangeModel } from '../../models/affectRangeModel';
import { AlertModel } from '../../models/alertModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { StatusModel } from '../../models/statusModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';
import { ChangeStatusDialogComponent } from '../change-status-dialog/change-status-dialog.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatInput } from '@angular/material/input';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-myalerts',
  templateUrl: './myalerts.component.html',
  styles: [
  ]
})
export class MyalertsComponent implements OnInit {

  user: UserModel;
  users: UserModel[];
  alerts: AlertModel[] = [];
  alertsOriginal: AlertModel[] = [];
  alertsStatusFilter: AlertModel[] = [];
  alertsUsersFilter: AlertModel[] = [];
  isOnStatusFilter = false;
  isOnUsersFilter = false;
  eventTypes: EventTypeModel[] = [];
  affectRanges: AffectRangeModel[] = [];
  mapType = 'satellite';
  status: StatusModel[];
  selectedStatus = "Todos";
  init_date = "";
  end_date = "";

  constructor(private auth: AuthService, private alertService: AlertsService, private references: ReferencesService,
    private route: ActivatedRoute, public router: Router, public dialog: MatDialog,private toastr: ToastrService) {
   this.user = this.route.snapshot.data['user'];
   this.users = this.route.snapshot.data['users'];
   this.alerts = this.route.snapshot.data['alerts'];
   this.eventTypes = this.route.snapshot.data['eventTypes'];
   this.affectRanges = this.route.snapshot.data['affectRanges'];
   this.alertsOriginal = this.alerts;
   this.status = [new StatusModel(11,"Alertado","status_type",null,1),
   new StatusModel(12,"Denegado","status_type",null,1),
   new StatusModel(13,"Aceptado","status_type",null,1)];
  }

  ngOnInit(): void {
  }

  resetFilters() {
    this.init_date = undefined;
    this.end_date = undefined;
    this.selectedStatus = "Todos";
  }

  dateChanged(event: any){
    //console.log(event.value);
    console.log(this.init_date);
    console.log(this.end_date);   
  }

  changeStatusDialog(event: any): void {
    Swal({  
      title: 'Realmente deseas cambiar el estado?',  
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {
          const dialogRef = this.dialog.open(ChangeStatusDialogComponent, {
            width: '350px',
            data: {selectedStatus: event.status_id,status: this.status},
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if(result != undefined){
              event.status_id = result;
              this.alertService.postUpdateEvent(this.auth.readToken(),event.id,event).subscribe({
                next: data => {
                  if(data['errors']!=undefined?data['errors'].length!=0:false){
                    data['errors'].map(res => {
                      this.toastr.error(res);
                    })
                  }
                  else{
                    Swal({
                      allowOutsideClick: false,
                      type: 'success',
                      text: 'Estado del evento cambiado con éxito'
                    });
                    this.alertService.getAlerts(this.auth.readToken()).subscribe({
                      next: data => {{
                        if(data==undefined){
                          this.toastr.error("Error al actualizar los datos");
                        }
                        else{
                          this.alerts = data;
                        }
                      }},
                      error: error => {
                        Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
                        console.log('There was an error',error)
                      }
                    })
                  }
                },
                error: error => {
                  Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
                  console.log('There was an error',error)
                }
              });
            }
          });
        } else if (result) {    
       }
    });

    
  }

  onSeeDetails(alert: any){
    console.log(alert);
    this.router.navigate(["home/admin-alerts/alert-detail/"+alert.id]);
  }

  onStatusSelected(event: any){
    this.applyStatusFilter(event);
  }

  onUserSelected(event: any){
    this.applyUserFilter(event);
  }

  applyUserFilter(event: any){
    this.isOnUsersFilter = true;
    const filterValue = event.value;
    if(this.isOnStatusFilter){
      if(filterValue == undefined){
        this.alerts = this.alertsStatusFilter;
        this.isOnUsersFilter = false;
      }
      else{
        this.alerts = this.alertsStatusFilter;
        this.alerts = this.alerts.filter(element=>element.user.id == filterValue);
        this.alertsUsersFilter = this.alerts;
      }
    }
    else{
      if(filterValue == undefined){
        this.alerts = this.alertsOriginal;
        this.isOnUsersFilter = false;
      }
      else{
        this.alerts = this.alertsOriginal;
        this.alerts = this.alerts.filter(element=>element.user.id == filterValue);
        this.alertsUsersFilter = this.alerts;
      }
    }
  }

  applyStatusFilter(event: any) {
    this.isOnStatusFilter = true;
    const filterValue = event.value;
    if(this.isOnUsersFilter){
      if(filterValue == "Todos"){
        this.alerts = this.alertsUsersFilter;
        this.isOnStatusFilter = false;
      }
      else{
        this.alerts = this.alertsUsersFilter;
        this.alerts = this.alerts.filter(element=>element.status.reference_name == filterValue);
        this.alertsStatusFilter = this.alerts;
      }
    }
    else{
      if(filterValue == "Todos"){
        this.alerts = this.alertsOriginal;
        this.isOnStatusFilter = false;
      }
      else{
        this.alerts = this.alertsOriginal;
        this.alerts = this.alerts.filter(element=>element.status.reference_name == filterValue);
        this.alertsStatusFilter = this.alerts;
      }
    }
    
  }

  editEvent(event: any){
    this.router.navigate(["/home/admin-alerts/edit-alert/"+event.id]);
  }

}
