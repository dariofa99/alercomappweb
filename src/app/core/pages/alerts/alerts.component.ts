import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { environment } from 'src/environments/environment';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styles: [
  ]
})
export class AlertsComponent implements OnInit {
  user: UserModel;
  users: UserModel[];
  alerts: AlertModel[] = [];
  alertsOriginal: AlertModel[] = [];
  alertsStatusFilter: AlertModel[] = [];
  alertsUsersFilter: AlertModel[] = [];
  isOnStatusFilter = false;
  isOnDateFilter = false;
  eventTypes: EventTypeModel[] = [];
  affectRanges: AffectRangeModel[] = [];
  mapType = 'satellite';
  status: StatusModel[];
  selectedStatus = 'Todos';
  init_date = '';
  end_date = '';
  statusFilterValue;

  changeStateEvent;
  hasChangeStateEvent = false;

  pageData = 1;
  alertsData: any;
  itemsPerPage = 6;
  totalItems: any;

  private url = environment.apiUrl;

  constructor(
    private auth: AuthService,
    private alertService: AlertsService,
    private references: ReferencesService,
    private route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private http: HttpClient,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.changeStateEvent = this.permissionsList.CAMBIAR_ESTADO_ALERTA;

    this.ngxPermissionsService
      .hasPermission(this.changeStateEvent)
      .then((result) => {
        this.hasChangeStateEvent = result;
      });

    this.user = this.route.snapshot.data['user'];
    this.users = this.route.snapshot.data['users'];
    this.alerts = this.route.snapshot.data['alerts'];
    this.eventTypes = this.route.snapshot.data['eventTypes'];
    this.affectRanges = this.route.snapshot.data['affectRanges'];
    this.alertsOriginal = this.alerts;
    this.status = [
      new StatusModel(11, 'Alertado', 'status_type', null, 1),
      new StatusModel(12, 'Denegado', 'status_type', null, 1),
      new StatusModel(13, 'Aceptado', 'status_type', null, 1),
      new StatusModel(23, 'Verificado', 'status_type', null, 1),
    ];
  }

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.auth.readToken()}`,
    });
    var urlToSend;
    if (this.hasChangeStateEvent) {
      urlToSend = `${this.url}/events?page=${this.pageData}`;
    } else {
      urlToSend = `${this.url}/events?data=my&page=${this.pageData}`;
    }
    this.http
      .get(urlToSend, {
        headers: headers,
      })
      .subscribe((data: any) => {
        this.alertsData = data.data;
        this.totalItems = data.total;
      });
  }

  gty(page: any) {
    this.pageData = page;
    if(this.isOnStatusFilter){
      this.statusFilter(this.statusFilterValue);
    }
    else if(this.isOnDateFilter){
      this.dateFilter(this.init_date,this.end_date);
    }
    else{
      var headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${this.auth.readToken()}`,
      });
  
      var urlToSend;
      urlToSend = `${this.url}/events?page=${this.pageData}`;
  
      this.http.get(urlToSend, { headers: headers }).subscribe((data: any) => {
        this.alertsData = data.data;
        this.totalItems = data.total;
      });
    }
  }

  resetFilters() {
    this.init_date = undefined;
    this.end_date = undefined;
    this.selectedStatus = 'Todos';
    this.statusFilterValue = undefined;
    this.isOnDateFilter = false;
    this.isOnStatusFilter = false;

    this.pageData = 1;

    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.auth.readToken()}`,
    });

    var urlToSend;
    urlToSend = `${this.url}/events?page=${this.pageData}`;
    this.http
      .get(urlToSend, {
        headers: headers,
      })
      .subscribe((data: any) => {
        this.alertsData = data.data;
        this.totalItems = data.total;
      });
  }

  dateChanged(event: any) {
    this.applyDateFilter(this.init_date, this.end_date);
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
          data: { selectedStatus: event.status_id, status: this.status },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result != undefined) {
            event.status_id = result;
            this.alertService
              .postUpdateEvent(this.auth.readToken(), event.id, event)
              .subscribe({
                next: (data) => {
                  if (
                    data['errors'] != undefined
                      ? data['errors'].length != 0
                      : false
                  ) {
                    data['errors'].map((res) => {
                      this.toastr.error(res);
                    });
                  } else {
                    Swal({
                      allowOutsideClick: false,
                      type: 'success',
                      text: 'Estado del evento cambiado con éxito',
                    });
                    this.getAllData();
                  }
                },
                error: (error) => {
                  Swal({
                    text: 'Ha ocurrido un error contacta a soporte@alercom.org',
                    type: 'error',
                  });
                  console.log('There was an error', error);
                },
              });
          }
        });
      } else if (result) {
      }
    });
  }

  onSeeDetails(alert: any) {
    this.router.navigate(['home/admin-alerts/alert-detail/' + alert.id]);
  }

  onStatusSelected(event: any) {
    this.applyStatusFilter(event);
  }

  applyDateFilter(init_date, end_date) {
    this.pageData = 1;
    this.dateFilter(init_date,end_date);
  }

  dateFilter(init_date, end_date){
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.auth.readToken()}`,
    });

    this.isOnDateFilter = true;
    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedInitDate = datepipe.transform(init_date, 'YYYY-MM-dd');
    let formattedEndDate = datepipe.transform(end_date, 'YYYY-MM-dd');

    if (this.isOnStatusFilter) {
      if (init_date == undefined || end_date == undefined) {
        //Remover filtro de fecha y aplicar filtro de estado
        this.isOnDateFilter = false;
        var urlToSend;
        urlToSend = `${this.url}/events?status_id=${this.statusFilterValue}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      } else {
        //Aplicar filtro de fecha y aplicar filtro de estado
        var urlToSend;
        urlToSend = `${this.url}/events?date_start=${formattedInitDate}&date_end=${formattedEndDate}&status_id=${this.statusFilterValue}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      }
    } else {
      if (init_date == undefined || end_date == undefined) {
        //Remover filtro de fecha y remover filtro de estado
        this.isOnDateFilter = false;
        var urlToSend;
        urlToSend = `${this.url}/events?page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      } else {
        //Aplicar filtro de fecha y remover filtro de estado
        var urlToSend;
        urlToSend = `${this.url}/events?date_start=${formattedInitDate}&date_end=${formattedEndDate}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      }
    }
  }

  applyStatusFilter(event: any) {
    this.pageData = 1;
    this.statusFilter(event.value);
  }

  statusFilter(value) {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${this.auth.readToken()}`,
    });

    this.isOnStatusFilter = true;
    const filterValue = value;
    this.statusFilterValue = filterValue;

    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedInitDate = datepipe.transform(this.init_date, 'YYYY-MM-dd');
    let formattedEndDate = datepipe.transform(this.end_date, 'YYYY-MM-dd');

    if (this.isOnDateFilter) {
      if (filterValue == 'Todos') {
        //Petición sin filtro de fecha incluido estado
        this.isOnStatusFilter = false;
        this.statusFilterValue = undefined;
        var urlToSend;
        urlToSend = `${this.url}/events?date_start=${formattedInitDate}&date_end=${formattedEndDate}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      } else {
        //Petición con filtro de estado incluido fecha
        var urlToSend;
        urlToSend = `${this.url}/events?date_start=${formattedInitDate}&date_end=${formattedEndDate}&status_id=${this.statusFilterValue}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      }
    } else {
      if (filterValue == 'Todos') {
        //Petición sin filtro de estado sin incluir fecha
        this.isOnStatusFilter = false;
        this.statusFilterValue = undefined;
        var urlToSend;
        urlToSend = `${this.url}/events?page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      } else {
        //Petición con filtro de estado sin incluir fecha
        var urlToSend;
        urlToSend = `${this.url}/events?status_id=${this.statusFilterValue}&page=${this.pageData}`;
        this.http
          .get(urlToSend, {
            headers: headers,
          })
          .subscribe((data: any) => {
            this.alertsData = data.data;
            this.totalItems = data.total;
          });
      }
    }
  }

  editEvent(event: any) {
    this.router.navigate(['/home/admin-alerts/edit-alert/' + event.id]);
  }

}
