import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AffectRangeModel } from '../../models/affectRangeModel';
import { AlertAdapter } from '../../models/alertModel';
import { CategoryModel } from '../../models/categoryModel';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import {
  AlertEditViewAdapter,
  AlertEditViewModel,
} from '../../models/alertEditViewModel';

@Component({
  selector: 'app-view-alert',
  templateUrl: './view-alert.component.html',
  styles: [],
})
export class ViewAlertComponent implements OnInit {
  zoom = 15;
  markers = [];
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions;

  isOnDepartment = false;
  isOnCategory = false;
  user: UserModel;
  alertByToken: AlertEditViewModel;
  eventTypes: EventTypeModel[] = [];
  affectRanges: AffectRangeModel[] = [];
  towns: TownModel[] = [];
  categories: CategoryModel[] = [];
  departments: DepartmentModel[] = [];
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

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private eventService: AlertsService,
    private auth: AuthService,
    private toastr: ToastrService,
    private adapterViewAlert: AlertEditViewAdapter
  ) {
    this.alertByToken = this.route.snapshot.data['alertByToken'];
    console.log(this.alertByToken);

    this.affectRanges.push(this.alertByToken.affectation_range);
    this.eventTypesToDisplay.push(this.alertByToken.event_type);
    this.townsToDisplay.push(this.alertByToken.town);
    this.departments.push(this.alertByToken.department);
    this.categories.push(this.alertByToken.event_type.category);

    if (
      this.alertByToken.latitude != undefined &&
      this.alertByToken.longitude != undefined
    ) {
      if (
        this.alertByToken.latitude != 0.0 &&
        this.alertByToken.longitude != 0.0
      ) {
        this.center = {
          lat: this.toFloat(this.alertByToken.latitude),
          lng: this.toFloat(this.alertByToken.longitude),
        };
      }
      this.isOnGoogleMap = true;
    }
    this.eventForm = this.formBuilder.group({
      event_description: ['', Validators.required],
      event_date: ['', Validators.required],
      event_place: ['', Validators.required],
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

    if (this.alertByToken.status.id == 11) {
      this.statusBtn = true;
    }

    this.markers.push({
      position: {
        lat: this.center.lat,
        lng: this.center.lng,
      },
      title: 'Ubicación Alerta',
      options: {
        animation: google.maps.Animation.DROP,
        clickable: false,
        draggable: false,
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
  }

  ngOnInit(): void {
    if (this.alertByToken != undefined) {
      this.eventForm.controls['event_description'].setValue(
        this.alertByToken.event_description
      );
      this.eventForm.controls['event_date'].setValue(
        this.alertByToken.event_date
      );
      this.eventForm.controls['event_place'].setValue(
        this.alertByToken.event_place
      );
      this.eventForm.controls['affected_people'].setValue(
        this.alertByToken.affected_people == 0 ? false : true
      );
      this.eventForm.controls['affected_family'].setValue(
        this.alertByToken.affected_family == 0 ? false : true
      );
      this.eventForm.controls['affected_animals'].setValue(
        this.alertByToken.affected_animals == 0 ? false : true
      );
      this.eventForm.controls['affected_infrastructure'].setValue(
        this.alertByToken.affected_infrastructure == 0 ? false : true
      );
      this.eventForm.controls['affected_livelihoods'].setValue(
        this.alertByToken.affected_livelihoods == 0 ? false : true
      );
      this.eventForm.controls['affected_environment'].setValue(
        this.alertByToken.affected_environment == 0 ? false : true
      );
      this.eventForm.controls['user_id'].setValue(this.alertByToken.user_id);
      this.eventForm.controls['event_type_id'].setValue(
        this.alertByToken.event_type_id
      );
      this.eventForm.controls['town_id'].setValue(this.alertByToken.town_id);
      this.eventForm.controls['status_id'].setValue(
        this.alertByToken.status_id
      );
      this.eventForm.controls['afectations_range_id'].setValue(
        this.alertByToken.afectations_range_id
      );

      this.eventFormToSend.controls['event_description'].setValue(
        this.alertByToken.event_description
      );
      this.eventFormToSend.controls['event_date'].setValue(
        this.alertByToken.event_date
      );
      this.eventFormToSend.controls['event_place'].setValue(
        this.alertByToken.event_place
      );
      this.eventFormToSend.controls['affected_people'].setValue(
        this.alertByToken.affected_people == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_family'].setValue(
        this.alertByToken.affected_family == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_animals'].setValue(
        this.alertByToken.affected_animals == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_infrastructure'].setValue(
        this.alertByToken.affected_infrastructure == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_livelihoods'].setValue(
        this.alertByToken.affected_livelihoods == 0 ? false : true
      );
      this.eventFormToSend.controls['affected_environment'].setValue(
        this.alertByToken.affected_environment == 0 ? false : true
      );
      this.eventFormToSend.controls['user_id'].setValue(
        this.alertByToken.user_id
      );
      this.eventFormToSend.controls['event_type_id'].setValue(
        this.alertByToken.event_type_id
      );
      this.eventFormToSend.controls['town_id'].setValue(
        this.alertByToken.town_id
      );
      this.eventFormToSend.controls['status_id'].setValue(
        this.alertByToken.status_id
      );
      this.eventFormToSend.controls['afectations_range_id'].setValue(
        this.alertByToken.afectations_range_id
      );
      this.isOnDepartment = true;
      this.isOnCategory = true;

      this.selectedDepartment = this.alertByToken.department.id;
      this.selectedCategory = this.alertByToken.event_type.category_id;

      if (this.alertByToken.files.length > 0) {
        this.imageEvent = this.alertByToken.files[0].real_path;
        this.imageEventAltName = this.alertByToken.files[0].original_name;
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
    this.eventFormToSend.controls['status_id'].setValue(13);
    if (this.eventFormToSend.valid) {
      this.eventService
        .postUpdateByToken(this.alertByToken.token, this.eventFormToSend.value)
        .subscribe({
          next: (data) => {
            {
              console.log(data);
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                this.statusBtn = false;
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Alerta aceptada con éxito',
                }).then((result) => {
                  window.location.reload();
                });
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
  }

  verifyEvent() {
    this.eventFormToSend.controls['status_id'].setValue(23);
    if (this.eventFormToSend.valid) {
      this.eventService
        .postUpdateByToken(this.alertByToken.token, this.eventFormToSend.value)
        .subscribe({
          next: (data) => {
            {
              console.log(data);
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                this.statusBtn = false;
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Alerta verificada con éxito',
                }).then((result) => {
                  window.location.reload();
                });
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
  }

  denyEvent() {
    this.eventFormToSend.controls['status_id'].setValue(12);
    if (this.eventFormToSend.valid) {
      this.eventService
        .postUpdateByToken(this.alertByToken.token, this.eventFormToSend.value)
        .subscribe({
          next: (data) => {
            {
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                this.statusBtn = false;
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Alerta denegada con éxito',
                }).then((result) => {
                  window.location.reload();
                });
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
