import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AffectRangeModel } from '../../models/affectRangeModel';
import { AlertAdapter, AlertModel } from '../../models/alertModel';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { AlertEditModel } from '../../models/alertEditModel';
import { CategoryModel } from '../../models/categoryModel';
import { GoogleMap } from '@angular/google-maps';
import { MarkerGoogleMaps } from '../../const/markerGoogleMaps';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';

@Component({
  selector: 'app-detail-alert',
  templateUrl: './detail-alert.component.html',
  styles: [],
})
export class DetailAlertComponent implements OnInit {
  @ViewChild('GoogleMap', { static: false }) map: GoogleMap;

  zoom = 15;
  markers = [];
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions;

  isOnDepartment = false;
  isOnCategory = false;
  user: UserModel;
  alertByID: AlertEditModel;
  eventTypes: EventTypeModel[] = [];
  affectRanges: AffectRangeModel[] = [];
  towns: TownModel[] = [];
  categories: CategoryModel[] = [];
  departments: DepartmentModel[];
  townsArray: Array<TownModel[]> = [];
  townsToDisplay: TownModel[] = [];
  eventTypesArray: Array<EventTypeModel[]> = [];
  eventTypesToDisplay: EventTypeModel[] = [];
  selectedCategory: number = -1;
  selectedDepartment: number = -1;
  selectedRange: number;
  selectedTown: number;
  selectedEventType: number;
  disableSelect: any;
  eventForm: FormGroup;
  eventFormToSend: FormGroup;
  statusBtn = false;
  isOnGoogleMap = false;
  imageEvent: string = '';
  imageEventAltName: string = '';
  
  changeStateEvent;
  hasChangeStateEvent = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private eventService: AlertsService,
    private auth: AuthService,
    private toastr: ToastrService,
    private adapterAlert: AlertAdapter,
    private markerGoogleMaps: MarkerGoogleMaps,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
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
    this.alertByID = this.route.snapshot.data['alertByID'];
    this.eventTypes = this.route.snapshot.data['eventTypes'];
    this.affectRanges = this.route.snapshot.data['affectRanges'];
    this.categories = this.route.snapshot.data['categories'];
    this.user = this.route.snapshot.data['user'];
    this.towns = this.route.snapshot.data['towns'];
    this.departments = this.route.snapshot.data['departments'];
    this.departments.forEach((element) => {
      let townsAux = [];
      this.towns.forEach((elementInside) => {
        if (element.id == elementInside.department_id) {
          townsAux.push(elementInside);
        }
      });
      this.townsArray.push(townsAux);
    });

    this.categories.forEach((element) => {
      let eventTypesAux = [];
      this.eventTypes.forEach((elementInside) => {
        if (element.id == elementInside.category_id) {
          eventTypesAux.push(elementInside);
        }
      });
      this.eventTypesArray.push(eventTypesAux);
    });

    if (
      this.alertByID.latitude != undefined &&
      this.alertByID.longitude != undefined
    ) {
      if (this.alertByID.latitude != 0.0 && this.alertByID.longitude != 0.0) {
        this.center = {
          lat: this.toFloat(this.alertByID.latitude),
          lng: this.toFloat(this.alertByID.longitude),
        };
        this.markers.push({
          position: {
            lat: this.center.lat,
            lng: this.center.lng,
          },
          label: this.markerGoogleMaps.LABEL,
          title: 'Ubicación Alerta',
          options: {
            animation: google.maps.Animation.DROP,
            clickable: false,
            draggable: false,
            icon: this.markerGoogleMaps.MARKERIMAGE,
          },
        });

        this.options = {
          mapTypeId: 'roadmap',
          zoomControl: true,
          scrollwheel: true,
          disableDoubleClickZoom: true,
          maxZoom: 15,
          minZoom: 8,
        };
        this.isOnGoogleMap = true;
      }
    }
    this.eventForm = this.formBuilder.group({
      event_description: ['', Validators.required],
      event_date: ['', Validators.required],
      event_place: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      event_aditional_information: [''],
      affected_people: [false],
      affected_family: [false],
      affected_animals: [false],
      affected_infrastructure: [false],
      affected_livelihoods: [false],
      affected_environment: [false],
      user_id: ['', Validators.required],
      event_type_id: ['', Validators.required],
      town_id: ['', Validators.required],
      status_id: ['', Validators.required],
      afectations_range_id: ['', Validators.required],
      category_id: ['', Validators.required],
      department_id: ['', Validators.required],
    });
    this.eventForm.disable();

    this.eventFormToSend = this.formBuilder.group({
      event_description: ['', Validators.required],
      event_date: ['', Validators.required],
      event_place: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      event_aditional_information: [''],
      affected_people: [false],
      affected_family: [false],
      affected_animals: [false],
      affected_infrastructure: [false],
      affected_livelihoods: [false],
      affected_environment: [false],
      user_id: ['', Validators.required],
      event_type_id: ['', Validators.required],
      town_id: ['', Validators.required],
      status_id: ['', Validators.required],
      afectations_range_id: ['', Validators.required],
    });

    if (this.alertByID.status.id == 11) {
      this.statusBtn = true;
    }
  }

  ngOnInit(): void {
    if (this.alertByID != undefined) {
      this.eventForm.controls['event_description'].setValue(
        this.alertByID.event_description
      );
      this.eventForm.controls['event_date'].setValue(this.alertByID.event_date);
      this.eventForm.controls['event_place'].setValue(
        this.alertByID.event_place
      );
      this.eventForm.controls['latitude'].setValue(this.alertByID.latitude);
      this.eventForm.controls['longitude'].setValue(this.alertByID.longitude);
      this.eventForm.controls['affected_people'].setValue(
        this.alertByID.affected_people == 0 ? false : true
      );
      this.eventForm.controls['affected_family'].setValue(
        this.alertByID.affected_family == 0 ? false : true
      );
      this.eventForm.controls['affected_animals'].setValue(
        this.alertByID.affected_animals == 0 ? false : true
      );
      this.eventForm.controls['affected_infrastructure'].setValue(
        this.alertByID.affected_infrastructure == 0 ? false : true
      );
      this.eventForm.controls['affected_livelihoods'].setValue(
        this.alertByID.affected_livelihoods == 0 ? false : true
      );
      this.eventForm.controls['affected_environment'].setValue(
        this.alertByID.affected_environment == 0 ? false : true
      );
      this.eventForm.controls['user_id'].setValue(this.alertByID.user_id);
      this.eventForm.controls['event_type_id'].setValue(
        this.alertByID.event_type_id
      );
      this.eventForm.controls['town_id'].setValue(this.alertByID.town_id);
      this.eventForm.controls['status_id'].setValue(this.alertByID.status_id);
      this.eventForm.controls['afectations_range_id'].setValue(
        this.alertByID.afectations_range_id
      );

      this.eventFormToSend.controls['event_description'].setValue(
        this.alertByID.event_description
      );
      this.eventFormToSend.controls['event_date'].setValue(
        this.alertByID.event_date
      );
      this.eventFormToSend.controls['event_place'].setValue(
        this.alertByID.event_place
      );
      this.eventFormToSend.controls['latitude'].setValue(
        this.alertByID.latitude
      );
      this.eventFormToSend.controls['longitude'].setValue(
        this.alertByID.longitude
      );
      this.eventFormToSend.controls['affected_people'].setValue(
        this.alertByID.affected_people == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_family'].setValue(
        this.alertByID.affected_family == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_animals'].setValue(
        this.alertByID.affected_animals == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_infrastructure'].setValue(
        this.alertByID.affected_infrastructure == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_livelihoods'].setValue(
        this.alertByID.affected_livelihoods == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_environment'].setValue(
        this.alertByID.affected_environment == 0 ? false : true
      );
      this.eventFormToSend.controls['user_id'].setValue(this.alertByID.user_id);
      this.eventFormToSend.controls['event_type_id'].setValue(
        this.alertByID.event_type_id
      );
      this.eventFormToSend.controls['town_id'].setValue(this.alertByID.town_id);
      this.eventFormToSend.controls['status_id'].setValue(
        this.alertByID.status_id
      );
      this.eventFormToSend.controls['afectations_range_id'].setValue(
        this.alertByID.afectations_range_id
      );
      this.isOnDepartment = true;
      this.isOnCategory = true;

      this.townsArray.forEach((element) => {
        element.forEach((elementInside) => {
          if (elementInside.id == this.alertByID.town_id) {
            this.selectedDepartment = elementInside.department_id;
          }
          if (elementInside.department_id == this.selectedDepartment) {
            this.townsToDisplay = element;
          }
        });
      });

      this.eventTypesArray.forEach((element) => {
        element.forEach((elementInside) => {
          if (elementInside.id == this.alertByID.event_type_id) {
            this.selectedCategory = elementInside.category_id;
          }
          if (elementInside.category_id == this.selectedCategory) {
            this.eventTypesToDisplay = element;
          }
        });
      });

      if (this.alertByID.files.length > 0) {
        this.imageEvent = this.alertByID.files[0].real_path;
        this.imageEventAltName = this.alertByID.files[0].original_name;
      }
      this.eventForm.controls['category_id'].setValue(this.selectedCategory);
      this.eventForm.controls['department_id'].setValue(
        this.selectedDepartment
      );
    }
  }

  onEventCategoryTypeSelected(event: any) {
    this.isOnCategory = true;
    this.eventTypesArray.forEach((element) => {
      element.forEach((elementInside) => {
        if (elementInside.category_id == event.value) {
          this.eventTypesToDisplay = element;
        }
      });
    });
  }

  backToList() {
    this.router.navigate(['/home/admin-alerts']);
  }

  onEventTypeSelected(event: any) {}

  checkboxChanged(event: any) {}

  onAffectRangeSelected(event: any) {}

  toFloat(value: any) {
    return parseFloat(value);
  }

  acceptEvent() {
    Swal({
      title: 'Realmente deseas cambiar el estado?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.eventFormToSend.controls['status_id'].setValue(13);
        if (this.eventFormToSend.valid) {
          this.eventService
            .postUpdateEvent(
              this.auth.readToken(),
              this.alertByID.id,
              this.eventFormToSend.value
            )
            .subscribe({
              next: (data) => {
                {
                  if (
                    data['errors'] != undefined
                      ? data['errors'].length != 0
                      : false
                  ) {
                    data['errors'].map((res) => {
                      this.toastr.error(res);
                    });
                  } else {
                    this.alertByID = this.adapterAlert.adapt(data['event']);
                    this.statusBtn = false;
                    Swal({
                      allowOutsideClick: false,
                      type: 'success',
                      text: 'Alerta aceptada con éxito',
                    }).then((result) => {});
                  }
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
      } else if (result) {
      }
    });
  }

  verifyEvent() {
    Swal({
      title: 'Realmente deseas cambiar el estado?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.eventFormToSend.controls['status_id'].setValue(23);
        if (this.eventFormToSend.valid) {
          this.eventService
            .postUpdateEvent(
              this.auth.readToken(),
              this.alertByID.id,
              this.eventFormToSend.value
            )
            .subscribe({
              next: (data) => {
                {
                  if (
                    data['errors'] != undefined
                      ? data['errors'].length != 0
                      : false
                  ) {
                    data['errors'].map((res) => {
                      this.toastr.error(res);
                    });
                  } else {
                    this.alertByID = this.adapterAlert.adapt(data['event']);
                    this.statusBtn = false;
                    Swal({
                      allowOutsideClick: false,
                      type: 'success',
                      text: 'Alerta verificada con éxito',
                    }).then((result) => {});
                  }
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
      } else if (result) {
      }
    });
  }

  denyEvent() {
    Swal({
      title: 'Realmente deseas cambiar el estado?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.eventFormToSend.controls['status_id'].setValue(12);
        if (this.eventFormToSend.valid) {
          this.eventService
            .postUpdateEvent(
              this.auth.readToken(),
              this.alertByID.id,
              this.eventFormToSend.value
            )
            .subscribe({
              next: (data) => {
                {
                  if (
                    data['errors'] != undefined
                      ? data['errors'].length != 0
                      : false
                  ) {
                    data['errors'].map((res) => {
                      this.toastr.error(res);
                    });
                  } else {
                    this.alertByID = this.adapterAlert.adapt(data['event']);
                    this.statusBtn = false;
                    Swal({
                      allowOutsideClick: false,
                      type: 'success',
                      text: 'Alerta denegada con éxito',
                    }).then((result) => {});
                  }
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
      } else if (result) {
      }
    });
  }

  onDepartmentSelected(event: any) {
    this.isOnDepartment = true;
    this.townsArray.forEach((element) => {
      element.forEach((elementInside) => {
        if (elementInside.department_id == event.value) {
          this.townsToDisplay = element;
        }
      });
    });
  }
}
