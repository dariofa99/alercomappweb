import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AffectRangeModel } from '../../models/affectRangeModel';
import { AlertModel } from '../../models/alertModel';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertEditModel } from '../../models/alertEditModel';
import { CategoryModel } from '../../models/categoryModel';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MarkerGoogleMaps } from '../../const/markerGoogleMaps';
import { GoogleAddressService } from '../../services/google-address.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { PreviousRouteService } from '../../services/previous-route.service';

export class ImageFiles {
  constructor(public filePath?: string, public file?: File) {}
}

export const DAYS_IN_MILISECONDS = 1000 * 60 * 60 * 24 * 8;
export const DEFAULT_MARKER_OPTIONS = {
  position: { lat: 1.2146697051829685, lng: -77.27854949154947 },
};

@Component({
  selector: 'app--new-edit-alert',
  templateUrl: './new-edit-alert.component.html',
  styles: [],
})
export class NewEditAlertComponent implements OnInit, AfterViewInit {
  @Input() addressType: string = 'establishment';
  place!: google.maps.places.PlaceResult;
  @ViewChild('addresstext') addresstext: any;

  establishmentAddress: Object;

  formattedAddress: string;
  formattedEstablishmentAddress: string;

  @ViewChild('GoogleMap', { static: false }) map: google.maps.Map;

  zoom = 18;
  markers = [];
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions;

  currentYear;
  dateFilter;
  minDate;
  maxDate;
  user: UserModel;
  eventForm!: FormGroup;
  actionBtn: string = 'Guardar';
  idToUpdate: number;
  alertByID: AlertEditModel;
  eventTypes: EventTypeModel[];
  affectRanges: AffectRangeModel[];
  towns: TownModel[] = [];
  categories: CategoryModel[] = [];
  departments: DepartmentModel[];
  isOnDepartment = false;
  isOnCategory = false;
  isOnGoogleMap = false;
  townsArray: Array<TownModel[]> = [];
  townsToDisplay: TownModel[] = [];
  eventTypesArray: Array<EventTypeModel[]> = [];
  eventTypesToDisplay: EventTypeModel[] = [];
  selectedDepartment: number = -1;
  selectedCategory: number = -1;
  selectedTown: number;
  event_date;
  imagesEvent: ImageFiles[] = [];
  loadingAmatai = false;
  hasChangeStateEvent = false;
  changeStateEvent;
  previousUrl;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private eventService: AlertsService,
    private http: HttpClient,
    private markerGoogleMaps: MarkerGoogleMaps,
    private googleAddressService: GoogleAddressService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList,
    private urlService: PreviousRouteService
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
    this.eventTypes = this.route.snapshot.data['eventTypes'];
    this.affectRanges = this.route.snapshot.data['affectRanges'];
    this.towns = this.route.snapshot.data['towns'];
    this.departments = this.route.snapshot.data['departments'];
    this.categories = this.route.snapshot.data['categories'];
    this.alertByID = this.route.snapshot.data['alertByID'];
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
      image_event: [],
    });
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

    if (this.alertByID == undefined) {
      this.minDate = new Date(Date.now() - DAYS_IN_MILISECONDS);
      this.maxDate = new Date();
    } else {
      let auxSplit = this.alertByID.event_date.split('-');
      this.event_date = new Date(
        parseInt(auxSplit[0]),
        parseInt(auxSplit[1]) - 1,
        parseInt(auxSplit[2])
      );
      this.minDate = new Date(this.event_date - DAYS_IN_MILISECONDS);
      this.maxDate = this.event_date;
    }
    
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        types: [this.addressType], // 'establishment' / 'address' / 'geocode' // we are checking all types
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.place = autocomplete.getPlace();

      this.markers = [];

      this.center = {
        lat: this.toFloat(this.place.geometry.location.lat()),
        lng: this.toFloat(this.place.geometry.location.lng()),
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
          draggable: true,
          icon: this.markerGoogleMaps.MARKERIMAGE,
        },
      });

      this.eventForm.controls['latitude'].setValue(this.center.lat);
      this.eventForm.controls['longitude'].setValue(this.center.lng);

      this.map.panTo(this.center);

      this.formattedAddress = this.googleAddressService.getFormattedAddress(
        this.place
      );
      this.eventForm.controls['event_place'].setValue(this.formattedAddress);
    });
  }

  googleMapDragEnd(event: any) {
    this.eventForm.controls['latitude'].setValue(event.latLng.lat().toFixed(6));
    this.eventForm.controls['longitude'].setValue(
      event.latLng.lng().toFixed(6)
    );
    var latlng = new google.maps.LatLng(
      event.latLng.lat().toFixed(6),
      event.latLng.lng().toFixed(6)
    );
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        var address = results[0].formatted_address;
        this.eventForm.controls['event_place'].setValue(address);
      }
    });
  }

  ngOnInit(): void {
    this.urlService.previousUrl$
    .subscribe((previousUrl: string) => {
        this.previousUrl = previousUrl
    });
    if (this.alertByID != undefined) {
      this.actionBtn = 'Actualizar';
      this.eventForm.controls['event_description'].setValue(
        this.alertByID.event_description
      );
      this.eventForm.controls['event_date'].setValue(this.event_date);
      this.eventForm.controls['event_place'].setValue(
        this.alertByID.event_place
      );
      this.eventForm.controls['event_aditional_information'].setValue(
        this.alertByID.event_aditional_information
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
      this.alertByID.files.forEach((element) => {
        fetch(element.real_path, {
          mode: 'no-cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        })
          .then((e) => {
            return e.blob();
          })
          .then((blob) => {
            let b: any = blob;
            b.lastModifiedDate = new Date();
            b.name = element.original_name;
            this.imagesEvent.push(new ImageFiles(element.real_path, b));
          });
      });
      this.isOnDepartment = true;
      this.isOnCategory = true;
    } else {
    }
    this.options = {
      mapTypeId: 'roadmap',
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
      maxZoom: 18,
      minZoom: 8,
    };
    this.isOnGoogleMap = true;
  }

  checkboxChanged(event: any) {}

  onFileInputClick() {
    Swal({
      title: 'Advertencia',
      text: 'Evite tomar fotografías a personas sin su consentimiento, solicite permiso previamente antes de cualquier acción al respecto. No realice registro fotográfico a menores de edad. Las fotografías deben evidenciar el hecho reportado, es decir, un imagen general del evento. La fotografía es para aportar a la información de análisis de las entidades y organizaciones responsables de atender el caso',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        let element: HTMLElement = document.querySelector(
          '#file'
        ) as HTMLElement;
        element.click();
      } else if (result) {
      }
    });
  }

  onFileSelected(event: Event) {
    if (this.imagesEvent.length == 0) {
      const inputNode: any = document.querySelector('#file');
      const reader = new FileReader();
      reader.onload = () => {
        this.imagesEvent.push(
          new ImageFiles(reader.result as string, inputNode.files[0])
        );
        this.fillEventForm(this.eventForm, this.imagesEvent);
      };
      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  deleteLocalFile(obj) {
    let indexImagesEvent: number = this.imagesEvent.findIndex(
      (item) => item === obj
    );
    if (indexImagesEvent > -1) {
      this.imagesEvent.splice(indexImagesEvent, 1);
      this.fillEventForm(this.eventForm, this.imagesEvent);
    }
  }

  fillEventForm(form: FormGroup, arrayImageFiles: ImageFiles[]) {
    const imagesFilesAux = [];
    arrayImageFiles.forEach((element) => {
      if (element.file.size != 0) {
        imagesFilesAux.push(element.file);
      }
    });
    form.patchValue({
      image_event: imagesFilesAux,
    });
  }

  onEventTypeSelected(event: any) {}

  onAffectRangeSelected(event: any) {}

  ngAfterViewInit(): void {
    if (this.actionBtn == 'Guardar') {
      this.eventForm.removeControl('status_id');
    }
    this.eventForm.controls['user_id'].setValue(this.user.id);

    if (this.alertByID != undefined) {
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
          draggable: true,
          icon: this.markerGoogleMaps.MARKERIMAGE,
        },
      });
    } else {
      this.center = {
        lat: this.toFloat(DEFAULT_MARKER_OPTIONS.position.lat),
        lng: this.toFloat(DEFAULT_MARKER_OPTIONS.position.lng),
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            this.center = {
              lat: this.toFloat(pos.lat),
              lng: this.toFloat(pos.lng),
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
                draggable: true,
                icon: this.markerGoogleMaps.MARKERIMAGE,
              },
            });

            this.eventForm.controls['latitude'].setValue(this.center.lat);
            this.eventForm.controls['longitude'].setValue(this.center.lng);

            var latlng = new google.maps.LatLng(
              this.center.lat,
              this.center.lng
            );
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                var address = results[0].formatted_address;
                this.eventForm.controls['event_place'].setValue(address);
              }
            });

            this.map.panTo(this.center);
          },
          () => {
            //Error getting CurrentPosition
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
                draggable: true,
                icon: this.markerGoogleMaps.MARKERIMAGE,
              },
            });

            this.eventForm.controls['latitude'].setValue(this.center.lat);
            this.eventForm.controls['longitude'].setValue(this.center.lng);

            var latlng = new google.maps.LatLng(
              this.center.lat,
              this.center.lng
            );
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                var address = results[0].formatted_address;
                this.eventForm.controls['event_place'].setValue(address);
              }
            });

            this.map.panTo(this.center);
          }
        );
      } else {
        // Browser doesn't support Geolocation
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
            draggable: true,
            icon: this.markerGoogleMaps.MARKERIMAGE,
          },
        });

        this.eventForm.controls['latitude'].setValue(this.center.lat);
        this.eventForm.controls['longitude'].setValue(this.center.lng);

        var latlng = new google.maps.LatLng(
          this.center.lat,
          this.center.lng
        );
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            var address = results[0].formatted_address;
            this.eventForm.controls['event_place'].setValue(address);
          }
        });

        this.map.panTo(this.center);
      }
    }

    this.getPlaceAutocomplete();

    const locationButton = document.createElement('button');

    locationButton.textContent = 'Mi ubicación';
    locationButton.classList.add('custom-map-control-button');

    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      locationButton
    );

    locationButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.center = {
              lat: this.toFloat(pos.lat),
              lng: this.toFloat(pos.lng),
            };
            this.markers = [];
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
                draggable: true,
                icon: this.markerGoogleMaps.MARKERIMAGE,
              },
            });

            this.eventForm.controls['latitude'].setValue(this.center.lat);
            this.eventForm.controls['longitude'].setValue(this.center.lng);

            var latlng = new google.maps.LatLng(
              this.center.lat,
              this.center.lng
            );
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status == google.maps.GeocoderStatus.OK) {
                var address = results[0].formatted_address;
                this.eventForm.controls['event_place'].setValue(address);
              }
            });

            this.map.panTo(this.center);
          },
          (error) => {
            //Error getting CurrentPosition
            this.toastr.error(error.message);
          }
        );
      } else {
        // Browser doesn't support Geolocation
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

  dateChanged(event: any) {
    if (this.alertByID == undefined) {
      const dateNow = Date.now();
      const diferrenceDays = Math.ceil(
        (dateNow - event.value) / (1000 * 3600 * 24)
      );
      if (diferrenceDays > 8 || diferrenceDays <= 0) {
        this.toastr.error(
          'La fecha no es valida, no puede registrar eventos futuros o que pasaron hace más de 8 días'
        );
      } else {
        const datepipe: DatePipe = new DatePipe('en-US');
        let formattedDate = datepipe.transform(event.value, 'YYYY-MM-dd');
        this.eventForm.controls['event_date'].setValue(formattedDate);
      }
    } else {
    }
  }

  addEvent() {
    this.loadingAmatai = true;
    let form = new FormData();
    if (this.eventForm.controls['image_event'].value != null) {
      //For Many Files
      //form.append('image_event[]', this.eventForm.get('image_event').value);
      form.append('image_event', this.eventForm.get('image_event').value[0]);
    }
    form.append(
      'event_description',
      this.eventForm.get('event_description').value
    );
    form.append('event_date', this.eventForm.get('event_date').value);
    form.append('event_place', this.eventForm.get('event_place').value);
    form.append(
      'event_aditional_information',
      this.eventForm.get('event_aditional_information').value
    );
    form.append('latitude', this.eventForm.get('latitude').value);
    form.append('longitude', this.eventForm.get('longitude').value);
    form.append(
      'affected_people',
      this.eventForm.get('affected_people').value == false ? '0' : '1'
    );
    form.append(
      'affected_family',
      this.eventForm.get('affected_family').value == false ? '0' : '1'
    );
    form.append(
      'affected_animals',
      this.eventForm.get('affected_animals').value == false ? '0' : '1'
    );
    form.append(
      'affected_infrastructure',
      this.eventForm.get('affected_infrastructure').value == false ? '0' : '1'
    );
    form.append(
      'affected_livelihoods',
      this.eventForm.get('affected_livelihoods').value == false ? '0' : '1'
    );
    form.append(
      'affected_environment',
      this.eventForm.get('affected_environment').value == false ? '0' : '1'
    );
    form.append('user_id', this.eventForm.get('user_id').value);
    form.append('event_type_id', this.eventForm.get('event_type_id').value);
    form.append('town_id', this.eventForm.get('town_id').value);
    form.append(
      'afectations_range_id',
      this.eventForm.get('afectations_range_id').value
    );

    if (this.eventForm.valid) {
      this.eventService.postEvent(this.auth.readToken(), form).subscribe({
        next: (data) => {
          {
            if (
              data['errors'] != undefined ? data['errors'].length != 0 : false
            ) {
              data['errors'].map((res) => {
                this.toastr.error(res);
              });
            } else {
              this.loadingAmatai = false;
              Swal({
                allowOutsideClick: false,
                type: 'success',
                text: 'Alerta creada con éxito',
              }).then((result) => {
                this.router.navigate(['/home/admin-alerts']);
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
    else{
      this.toastr.error("Diligencia todos los campos obligatorios");
    }
  }
  updateEvent() {
    this.loadingAmatai = true;
    let form = new FormData();
    if (this.eventForm.controls['image_event'].value != null) {
      //For Many Files
      //form.append('image_event[]', this.eventForm.get('image_event').value);
      form.append('image_event', this.eventForm.get('image_event').value[0]);
    }
    form.append(
      'event_description',
      this.eventForm.get('event_description').value
    );
    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedDate = datepipe.transform(
      this.eventForm.get('event_date').value,
      'YYYY-MM-dd'
    );
    this.eventForm.controls['event_date'].setValue(formattedDate);
    form.append('event_date', this.eventForm.get('event_date').value);
    form.append('event_place', this.eventForm.get('event_place').value);
    form.append(
      'event_aditional_information',
      this.eventForm.get('event_aditional_information').value
    );
    form.append('latitude', this.eventForm.get('latitude').value);
    form.append('longitude', this.eventForm.get('longitude').value);
    form.append(
      'affected_people',
      this.eventForm.get('affected_people').value == false ? '0' : '1'
    );
    form.append(
      'affected_family',
      this.eventForm.get('affected_family').value == false ? '0' : '1'
    );
    form.append(
      'affected_animals',
      this.eventForm.get('affected_animals').value == false ? '0' : '1'
    );
    form.append(
      'affected_infrastructure',
      this.eventForm.get('affected_infrastructure').value == false ? '0' : '1'
    );
    form.append(
      'affected_livelihoods',
      this.eventForm.get('affected_livelihoods').value == false ? '0' : '1'
    );
    form.append(
      'affected_environment',
      this.eventForm.get('affected_environment').value == false ? '0' : '1'
    );
    form.append('user_id', this.eventForm.get('user_id').value);
    form.append('event_type_id', this.eventForm.get('event_type_id').value);
    form.append('town_id', this.eventForm.get('town_id').value);
    form.append(
      'afectations_range_id',
      this.eventForm.get('afectations_range_id').value
    );
    if (this.eventForm.valid) {
      this.eventService
        .postUpdateEvent(this.auth.readToken(), this.alertByID.id, form)
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
                this.loadingAmatai = false;
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Alerta actualizada con éxito',
                }).then((result) => {
                  this.router.navigate(['/home/admin-alerts']);
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
    else{
      this.toastr.error("Diligencia todos los campos obligatorios");
    }
  }

  toFloat(value: any) {
    return parseFloat(value);
  }

  backToList() {
    if(this.hasChangeStateEvent){
      if(this.previousUrl == "/home/admin-alerts"){
        this.router.navigate(['/home/admin-alerts']);
      }
      else if(this.previousUrl == "/home/admin-my-alerts"){
        this.router.navigate(['/home/admin-my-alerts']);
      }
    }
    else{
      this.router.navigate(['/home/admin-my-alerts']);
    }
  }
}
