import { AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
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
import { DatePipe} from '@angular/common';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { DateAdapter } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { AlertEditModel } from '../../models/alertEditModel';
import { CategoryModel } from '../../models/categoryModel';

export class ImageFiles{
  constructor(
    public filePath?: string,
    public file?: File,
  ){}
}

@Component({
  selector: 'app--new-edit-alert',
  templateUrl: './new-edit-alert.component.html',
  styles: [
  ]
})
export class NewEditAlertComponent implements OnInit, AfterViewInit {

  user: UserModel;
  eventForm !: FormGroup;
  actionBtn : string = "Guardar";
  idToUpdate: number;
  alertByID: AlertEditModel;
  eventTypes: EventTypeModel[];
  affectRanges: AffectRangeModel[];
  towns: TownModel[] = [];
  categories: CategoryModel[] = [];
  departments: DepartmentModel[];
  isOnDepartment = false;
  isOnCategory = false;
  townsArray: Array<TownModel[]> = [];
  townsToDisplay: TownModel[] = [];
  eventTypesArray: Array<EventTypeModel[]> = [];
  eventTypesToDisplay: EventTypeModel[] = [];
  selectedDepartment: number = -1;
  selectedCategory: number = -1;
  selectedTown: number;
  event_date;
  imagesEvent : ImageFiles[] = [];
  
  constructor(private auth: AuthService,private route: ActivatedRoute, public router: Router,
    private formBuilder: FormBuilder,private toastr: ToastrService, private eventService: AlertsService,
    private http: HttpClient) {
      this.user = this.route.snapshot.data['user'];
      this.eventTypes = this.route.snapshot.data['eventTypes'];
      this.affectRanges = this.route.snapshot.data['affectRanges'];
      this.towns = this.route.snapshot.data['towns'];
      this.departments = this.route.snapshot.data['departments'];
      this.categories = this.route.snapshot.data['categories'];
      this.alertByID = this.route.snapshot.data['alertByID'];
      this.eventForm = this.formBuilder.group({
        event_description: ['',Validators.required,],
        event_date: ['',Validators.required],
        event_place: ['',Validators.required],
        event_aditional_information: [''],
        affected_people: [false],
        affected_family: [false],
        affected_animals: [false],
        affected_infrastructure: [false],
        affected_livelihoods: [false],
        affected_environment: [false],
        user_id: ['',Validators.required],
        event_type_id: ['',Validators.required],
        town_id: ['',Validators.required],
        status_id: ['',Validators.required],
        afectations_range_id: ['',Validators.required],
        image_event: []
      });
      this.departments.forEach(element => {
        let townsAux = [];
        this.towns.forEach(elementInside => {
          if(element.id == elementInside.department_id){
            townsAux.push(elementInside);
          }
        });
        this.townsArray.push(townsAux);
      });

      this.categories.forEach(element => {
        let eventTypesAux = [];
        this.eventTypes.forEach(elementInside => {
          if(element.id == elementInside.category_id){
            eventTypesAux.push(elementInside);
          }
        });
        this.eventTypesArray.push(eventTypesAux);
      });
     }

  ngOnInit(): void {
    if(this.alertByID != undefined){
      console.log(this.alertByID);
      this.actionBtn = "Actualizar";
      this.eventForm.controls['event_description'].setValue(this.alertByID.event_description);
      let auxSplit = this.alertByID.event_date.split('-');
      this.event_date = new Date(parseInt(auxSplit[0]),parseInt(auxSplit[1])-1,parseInt(auxSplit[2]));
      this.eventForm.controls['event_date'].setValue(new Date(parseInt(auxSplit[0]),parseInt(auxSplit[1])-1,parseInt(auxSplit[2])));
      this.eventForm.controls['event_place'].setValue(this.alertByID.event_place);
      this.eventForm.controls['affected_people'].setValue(this.alertByID.affected_people==0?false:true);
      this.eventForm.controls['affected_family'].setValue(this.alertByID.affected_family==0?false:true);
      this.eventForm.controls['affected_animals'].setValue(this.alertByID.affected_animals==0?false:true);
      this.eventForm.controls['affected_infrastructure'].setValue(this.alertByID.affected_infrastructure==0?false:true);
      this.eventForm.controls['affected_livelihoods'].setValue(this.alertByID.affected_livelihoods==0?false:true);
      this.eventForm.controls['affected_environment'].setValue(this.alertByID.affected_environment==0?false:true);
      this.eventForm.controls['user_id'].setValue(this.alertByID.user_id);
      this.eventForm.controls['event_type_id'].setValue(this.alertByID.event_type_id);
      this.eventForm.controls['town_id'].setValue(this.alertByID.town_id);
      this.eventForm.controls['status_id'].setValue(this.alertByID.status_id);
      this.eventForm.controls['afectations_range_id'].setValue(this.alertByID.afectations_range_id);
      this.alertByID.files.forEach(element => {
      fetch(element.real_path,{
        mode: 'no-cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }})
      .then((e) => {
        return e.blob()
      })
      .then((blob) => {
        let b: any = blob
        b.lastModifiedDate = new Date()
        b.name = element.original_name
        this.imagesEvent.push(new ImageFiles(element.real_path,b))
      })
      });
      this.isOnDepartment = true;
      this.isOnCategory = true;
      console.log(this.imagesEvent);
    }
  }

  checkboxChanged(event: any){

  }

  onFileInputClick(){
    Swal({  
      title: 'Advertencia',  
      text: 'Evite tomar fotografías a personas sin su consentimiento, solicite permiso previamente antes de cualquier acción al respecto. No realice registro fotográfico a menores de edad. Las fotografías deben evidenciar el hecho reportado, es decir, un imagen general del evento. La fotografía es para aportar a la información de análisis de las entidades y organizaciones responsables de atender el caso',
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {    
          let element: HTMLElement = document.querySelector('#file') as HTMLElement;
          element.click();
        
        } else if (result) {
       }
    });
  }

  onFileSelected(event: Event) {
    if(this.imagesEvent.length==0){
      const inputNode: any = document.querySelector('#file');
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagesEvent.push(new ImageFiles(reader.result as string,inputNode.files[0]))
        this.fillEventForm(this.eventForm,this.imagesEvent)
        console.log(this.eventForm.value);
      }
      reader.readAsDataURL(inputNode.files[0])
    }
  }

  deleteLocalFile(obj){
    let indexImagesEvent: number = this.imagesEvent.findIndex(item => item === obj);
      if (indexImagesEvent > -1) {
        this.imagesEvent.splice(indexImagesEvent, 1);
        this.fillEventForm(this.eventForm,this.imagesEvent)
        console.log(this.eventForm.value);
      }
  }

  fillEventForm(form: FormGroup, arrayImageFiles: ImageFiles[]){
    const imagesFilesAux = [];
    arrayImageFiles.forEach(element => {
      if(element.file.size!=0){
        imagesFilesAux.push(element.file);
      }
    });
    form.patchValue({
      image_event: imagesFilesAux
    });
  }

  onEventTypeSelected(event: any){

  }

  onAffectRangeSelected(event: any){

  }

  ngAfterViewInit(): void {
    if(this.actionBtn == "Guardar"){
      this.eventForm.removeControl('status_id');
    }
    this.eventForm.controls['user_id'].setValue(this.user.id);

    if(this.alertByID != undefined){
      this.townsArray.forEach(element => {
        element.forEach(elementInside => {
          if(elementInside.id == this.alertByID.town_id){
            this.selectedDepartment = elementInside.department_id;
          }
          if(elementInside.department_id == this.selectedDepartment){
            this.townsToDisplay = element;
          }
        });
      });

      this.eventTypesArray.forEach(element => {
        element.forEach(elementInside => {
          if(elementInside.id == this.alertByID.event_type_id){
            this.selectedCategory = elementInside.category_id;
          }
          if(elementInside.category_id == this.selectedCategory){
            this.eventTypesToDisplay = element;
          }
        });
      });
    }
  }

  onDepartmentSelected(event: any){
    this.isOnDepartment = true;
    this.townsArray.forEach(element => {
      element.forEach(elementInside => {
        if(elementInside.department_id == event.value){
          this.townsToDisplay = element;
        }
      });
    });
  }

  onEventCategoryTypeSelected(event: any){
    this.isOnCategory = true;
    this.eventTypesArray.forEach(element => {
      element.forEach(elementInside => {
        if(elementInside.category_id == event.value){
          this.eventTypesToDisplay = element;
        }
      });
    });
  }

  dateChanged(event: any){
    const dateNow = Date.now();
    const diferrenceDays = Math.ceil((dateNow - event.value) / (1000 * 3600 * 24))
    if(diferrenceDays>8 || diferrenceDays <= 0){
      this.toastr.error('La fecha no es valida, no puede registrar eventos futuros o que pasaron hace más de 8 días');
    }
    else{
      const datepipe: DatePipe = new DatePipe('en-US');
      let formattedDate = datepipe.transform(event.value, 'YYYY-MM-dd')
      this.eventForm.controls['event_date'].setValue(formattedDate);
    }
  }

  addEvent(){
    let form = new FormData();
    if(this.eventForm.controls['image_event'].value != ""){
      //For Many Files
      //form.append('image_event[]', this.eventForm.get('image_event').value);
      form.append('image_event', this.eventForm.get('image_event').value[0]);
    }
    form.append('event_description', this.eventForm.get('event_description').value);
    form.append('event_date', this.eventForm.get('event_date').value);
    form.append('event_place', this.eventForm.get('event_place').value);
    form.append('event_aditional_information', this.eventForm.get('event_aditional_information').value);
    form.append('affected_people', this.eventForm.get('affected_people').value==false?'0':'1');
    form.append('affected_family', this.eventForm.get('affected_family').value==false?'0':'1');
    form.append('affected_animals', this.eventForm.get('affected_animals').value==false?'0':'1');
    form.append('affected_infrastructure', this.eventForm.get('affected_infrastructure').value==false?'0':'1');
    form.append('affected_livelihoods', this.eventForm.get('affected_livelihoods').value==false?'0':'1');
    form.append('affected_environment', this.eventForm.get('affected_environment').value==false?'0':'1');
    form.append('user_id', this.eventForm.get('user_id').value);
    form.append('event_type_id', this.eventForm.get('event_type_id').value);
    form.append('town_id', this.eventForm.get('town_id').value);
    form.append('afectations_range_id', this.eventForm.get('afectations_range_id').value);
    
    if(this.eventForm.valid){
      this.eventService.postEvent(this.auth.readToken(),form).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Alerta creada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-alerts']);
            });
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }
  updateEvent(){
    console.log(this.eventForm.value);
    let form = new FormData();
    if(this.eventForm.controls['image_event'].value != ""){
      //For Many Files
      //form.append('image_event[]', this.eventForm.get('image_event').value);
      form.append('image_event', this.eventForm.get('image_event').value[0]);
    }
    form.append('event_description', this.eventForm.get('event_description').value);
    const datepipe: DatePipe = new DatePipe('en-US');
    let formattedDate = datepipe.transform(this.eventForm.get('event_date').value, 'YYYY-MM-dd')
    this.eventForm.controls['event_date'].setValue(formattedDate);
    form.append('event_date', this.eventForm.get('event_date').value);
    form.append('event_place', this.eventForm.get('event_place').value);
    form.append('event_aditional_information', this.eventForm.get('event_aditional_information').value);
    form.append('affected_people', this.eventForm.get('affected_people').value==false?'0':'1');
    form.append('affected_family', this.eventForm.get('affected_family').value==false?'0':'1');
    form.append('affected_animals', this.eventForm.get('affected_animals').value==false?'0':'1');
    form.append('affected_infrastructure', this.eventForm.get('affected_infrastructure').value==false?'0':'1');
    form.append('affected_livelihoods', this.eventForm.get('affected_livelihoods').value==false?'0':'1');
    form.append('affected_environment', this.eventForm.get('affected_environment').value==false?'0':'1');
    form.append('user_id', this.eventForm.get('user_id').value);
    form.append('event_type_id', this.eventForm.get('event_type_id').value);
    form.append('town_id', this.eventForm.get('town_id').value);
    form.append('afectations_range_id', this.eventForm.get('afectations_range_id').value);
    if(this.eventForm.valid){
      this.eventService.postUpdateEvent(this.auth.readToken(),this.alertByID.id,form).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Alerta actualizada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-alerts']);
            });
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }

}
