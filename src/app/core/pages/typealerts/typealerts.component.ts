import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PermissionsList } from '../../const/permissionsList';
import { EventTypeModel } from '../../models/eventTypeModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { EventypesService } from '../../services/eventypes.service';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { ReferencesService } from '../../services/references.service';

export class EventTypeToDisplay {
  constructor(
    public id?: number,
    public event_type_name?: string,
    public event_type_description?: string,
    public category?: string
  ) {}
}

@Component({
  selector: 'app-typealerts',
  templateUrl: './typealerts.component.html',
  styles: [],
})
export class TypealertsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'event_type_name',
    'event_type_description',
    'category',
    'action',
  ];
  displayedColumnsSpanish: string[] = [
    'ID',
    'Nombre',
    'Descripción',
    'Categoría',
    'Acción',
  ];
  dataSource: MatTableDataSource<EventTypeToDisplay>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  eventTypes: EventTypeModel[];
  eventTypesToDisplay: EventTypeToDisplay[] = [];
  readTypeAlertPermission;
  createTypeAlertPermission;
  editTypeAlertPermission;
  deleteTypeAlertPermission;

  constructor(
    private auth: AuthService,
    private references: ReferencesService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private eventTypeService: EventypesService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.readTypeAlertPermission = this.permissionsList.VER_TIPOS_ALERTAS;
    this.createTypeAlertPermission = this.permissionsList.CREAR_TIPOS_ALERTAS;
    this.editTypeAlertPermission = this.permissionsList.EDITAR_TIPOS_ALERTAS;
    this.deleteTypeAlertPermission = this.permissionsList.ELIMINAR_TIPOS_ALERTAS;

    this.user = this.route.snapshot.data['user'];
    this.eventTypes = this.route.snapshot.data['eventTypes'];
  }

  ngOnInit(): void {
    this.eventTypes.forEach((element) => {
      this.eventTypesToDisplay.push(
        new EventTypeToDisplay(
          element.id,
          element.event_type_name,
          element.event_type_description,
          element.category.reference_name
        )
      );
    });

    this.dataSource = new MatTableDataSource(this.eventTypesToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addEventType() {
    this.router.navigate(['/home/admin-event-types/add-event-type']);
  }

  editEventType(eventType: any) {
    this.router.navigate([
      '/home/admin-event-types/edit-event-type/' + eventType.id,
    ]);
  }

  deleteEventType(id: number) {
    Swal({
      title: 'Realmente deseas eliminar este tipo de alerta?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.eventTypeService
          .deleteEventType(this.auth.readToken(), id)
          .subscribe({
            next: (data) => {
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Tipo de Alerta eliminada con éxito',
                });
                this.eventTypes = this.eventTypes.filter(
                  (item) => item.id != id
                );
                this.eventTypesToDisplay = this.eventTypesToDisplay.filter(
                  (item) => item.id != id
                );
                this.dataSource = new MatTableDataSource(
                  this.eventTypesToDisplay
                );
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
      } else if (result) {
      }
    });
  }
}
