import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { InstitutionsEditModel } from '../../models/institutionsEditModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';
import Swal from 'sweetalert2';
import { InstitutionsService } from '../../services/institutions.service';
import { MatSelect } from '@angular/material/select';
import { ContactModel } from '../../models/contactModel';

@Component({
  selector: 'app-new-edit-institution',
  templateUrl: './new-edit-institution.component.html',
  styles: [
  ]
})
export class NewEditInstitutionComponent implements OnInit, AfterViewInit {

  
  @ViewChild('contactType') contactType: MatSelect; 
  @ViewChild('inputContact') inputContact;
  @ViewChild('eventType') eventType; 

  institutionForm !: FormGroup;
  departments: DepartmentModel[];
  towns: TownModel[] = [];
  townsToDisplay: TownModel[] = [];
  townsArray: Array<TownModel[]> = [];
  eventTypes: EventTypeModel[] = [];
  isOnDepartment = false;
  selectedDepartment: number;
  selectedTown: number;
  actionBtn : string = "Guardar";
  id: any;
  institutionByID: InstitutionsEditModel;

  contacts: ContactModel[] = [];
  contacts_name = [];
  contact_type_id = [];
  contact_id = [];
  event_types_names = [];
  eventTypeInstitution: EventTypeModel[] = [];
  event_types_id = [];
  event_type_aux: EventTypeModel;
  user: UserModel;

  constructor(private auth: AuthService, private alertService: AlertsService, private references: ReferencesService,
    private route: ActivatedRoute, public router: Router, private toastr: ToastrService, private formBuilder: FormBuilder,
    private institutionsService: InstitutionsService) {

    this.user = this.route.snapshot.data['user'];

    this.institutionForm = this.formBuilder.group({
      institution_name: ['',Validators.required],
      institution_address: ['',Validators.required],
      institution_phone: ['',Validators.required],
      town_id: ['',Validators.required],
      contacts:['',Validators.required],
      contact_id:['',Validators.required],
      contact_type_id: ['',Validators.required],
      event_types: ['',Validators.required]
    });

  this.id = this.route.snapshot.paramMap.get("id");
  this.departments = this.route.snapshot.data['departments'];
  this.towns = this.route.snapshot.data['towns'];
  this.eventTypes = this.route.snapshot.data['eventTypes'];
  this.departments.forEach(element => {
    let townsAux = [];
    this.towns.forEach(elementInside => {
      if(element.id == elementInside.department_id){
        townsAux.push(elementInside);
      }
    });
    this.townsArray.push(townsAux);
  });
  this.institutionByID = this.route.snapshot.data['institutionByID'];
  //console.log(this.institutionByID);
  }

  ngOnInit(): void {
    if(this.institutionByID != undefined){
      this.actionBtn = "Actualizar";
      this.institutionForm.controls['institution_name'].setValue(this.institutionByID.institution_name);
      this.institutionForm.controls['institution_address'].setValue(this.institutionByID.institution_address);
      this.institutionForm.controls['institution_phone'].setValue(this.institutionByID.institution_phone);
      this.institutionForm.controls['town_id'].setValue(this.institutionByID.town_id);
      this.institutionByID.contacts.forEach(element => {
        this.contacts_name.push(element.institution_contact)
        this.contacts.push(element);
        this.contact_type_id.push(element.contact_type_id);
        this.contact_id.push(element.id);
      });
      this.institutionByID.event_types.forEach(element => {
        this.eventTypeInstitution.push(element);
        this.event_types_id.push(element.id);
        this.event_types_names.push(element.event_type_name);
      });
      this.selectedTown = this.institutionByID.town_id;
      this.institutionForm.controls['contacts'].setValue(this.contacts_name);
      this.institutionForm.controls['contact_id'].setValue(this.contact_id);
      this.institutionForm.controls['contact_type_id'].setValue(this.contact_type_id);
      this.institutionForm.controls['event_types'].setValue(this.event_types_id);
      this.isOnDepartment = true;
    }
    else{
      this.institutionForm.removeControl('contact_id');
    }
    
  }

  ngAfterViewInit(): void {
    if(this.institutionByID != undefined){
      this.townsArray.forEach(element => {
        element.forEach(elementInside => {
          if(elementInside.id == this.institutionByID.town_id){
            this.selectedDepartment = elementInside.department_id;
          }
          if(elementInside.department_id == this.selectedDepartment){
            this.townsToDisplay = element;
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

  onAddContact(){
    //TODO: Add contact for save and for edit, the logic is diferent
    if(this.contactType.value!="" && this.inputContact.nativeElement.value!=""){
      if(this.actionBtn == "Guardar"){
      //Check for new contact
      let isContactOnInstitution = false;
      
      if(this.contacts_name.length == 0){
        isContactOnInstitution = false;
      }else{
        this.contacts_name.forEach(element => {
          if(element == this.inputContact.nativeElement.value){
            isContactOnInstitution = true;
          }
        });
      }

      if(isContactOnInstitution){
        this.toastr.error("El contacto ya pertenece a esta institución");
      }
      else{
        this.contact_type_id.push(this.contactType.value);
        this.contacts.push(new ContactModel(0,this.inputContact.nativeElement.value,this.contactType.value,0));
        this.contacts_name.push(this.inputContact.nativeElement.value);
        this.institutionForm.controls['contacts'].setValue(this.contacts_name);
        this.institutionForm.controls['contact_type_id'].setValue(this.contact_type_id);
      }
      }
      else{
      let isContactOnInstitution = false;
      if(this.contacts_name.length == 0){
        isContactOnInstitution = false;
      }else{
        this.contacts.forEach(element => {
          if(element.institution_contact == this.inputContact.nativeElement.value){
            isContactOnInstitution = true;
          }
        });
      }

      if(isContactOnInstitution){
        this.toastr.error("El contacto ya pertenece a esta institución");
      }
      else{
        this.contact_type_id.push(this.contactType.value);
        this.contacts_name.push(this.inputContact.nativeElement.value);
        this.contact_id.push(0);
        this.contacts.push(new ContactModel(0,this.inputContact.nativeElement.value,this.contactType.value,0));
        this.institutionForm.controls['contact_id'].setValue(this.contact_id);
        this.institutionForm.controls['contacts'].setValue(this.contacts_name);
        this.institutionForm.controls['contact_type_id'].setValue(this.contact_type_id);
      }
      
      }
      //Clean data
      this.inputContact.nativeElement.value = "";
      this.contactType.value = "";
    }
  }

  onAddEventType(){
    if(this.eventType.nativeElement.value!=""){
      let isNewEventType = true;
      this.eventTypeInstitution.forEach(element => {
        if(element.id == this.eventType.nativeElement.value){
          isNewEventType = false;
        }
      });
      if(this.event_type_aux != null){
        if(isNewEventType){
          this.eventTypeInstitution.push(this.event_type_aux)
        this.event_types_id.push(this.eventType.nativeElement.value)
        this.event_types_names.push(this.eventType.nativeElement.options[this.eventType.nativeElement.selectedIndex].innerText)
        this.institutionForm.controls['event_types'].setValue(this.event_types_id);
        this.event_type_aux = null;
        }
        else{
          this.toastr.error("Este tipo de alerta ya existe");
        }
      }
      else{
        this.toastr.error("No ha seleccionado ninguna alerta");
      }
      
      //Clean data
      this.eventType.nativeElement.value = "";
    }
  }

  onEventTypeSelected(event: any){
     this.event_type_aux = this.eventTypes.find(t=>t.id.toString() ===event.target.value);
  }

  onContactTypeSelected(event: any){

  }

  removeFromContactList(obj){
    if(this.actionBtn == "Guardar"){
      let indexContactsName: number = this.contacts_name.findIndex(item => item === obj.institution_contact);
      if (indexContactsName > -1) {
        this.contacts_name.splice(indexContactsName, 1);
      }
  
      let indexContactTypeID: number = this.contact_type_id.findIndex(item => item === obj.contact_type_id);
      if (indexContactTypeID > -1) {
        this.contact_type_id.splice(indexContactTypeID, 1);
      }

      let indexContacts: number = this.contacts.findIndex(item => item.institution_contact === obj.institution_contact);
      if (indexContacts > -1) {
        this.contacts.splice(indexContacts, 1);
      }
    }
    else{
      let indexContactsName: number = this.contacts_name.findIndex(item => item === obj.institution_contact);
      if (indexContactsName > -1) {
        this.contacts_name.splice(indexContactsName, 1);
      }
  
      let indexContactTypeID: number = this.contact_type_id.findIndex(item => item === obj.contact_type_id);
      if (indexContactTypeID > -1) {
        this.contact_type_id.splice(indexContactTypeID, 1);
      }

      let indexContactID: number = this.contact_id.findIndex(item => item === obj.id);
      if (indexContactID > -1) {
        this.contact_id.splice(indexContactID, 1);
      }
  
      let indexContacts: number = this.contacts.findIndex(item => item.institution_contact === obj.institution_contact);
      if (indexContacts > -1) {
        this.contacts.splice(indexContacts, 1);
      }
      
      this.institutionForm.controls['contact_id'].setValue(this.contact_id);
    }

    this.institutionForm.controls['contacts'].setValue(this.contacts_name);
    this.institutionForm.controls['contact_type_id'].setValue(this.contact_type_id);
  }

  removeFromEventTypeList(obj){
    let index: number = this.eventTypeInstitution.findIndex(item => item === obj);
    if (index > -1) {
      this.eventTypeInstitution.splice(index, 1);
    }

    let indexEventTypeID: number = this.event_types_id.findIndex(item => item === obj.id);
    if (indexEventTypeID > -1) {
      this.event_types_id.splice(indexEventTypeID, 1);
    }

    let indexEventTypeNames: number = this.event_types_names.findIndex(item => item === obj.event_type_name);
    if (indexEventTypeNames > -1) {
      this.event_types_names.splice(indexEventTypeNames, 1);
    }

    this.institutionForm.controls['event_types'].setValue(this.event_types_id);
  }

  addInstitution(){
    if(this.institutionForm.valid){
      console.log(this.eventTypes)
      this.institutionsService.postInstitution(this.auth.readToken(),this.institutionForm.value).subscribe({
        next: data => {{
          console.log(data);
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Institución creada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-institutions']);
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

  updateInstitution(){
    console.log(this.institutionForm.value)
    if(this.institutionForm.valid){
      this.institutionsService.putInstitution(this.auth.readToken(),this.institutionByID.id,this.institutionForm.value).subscribe({
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
              text: 'Institución actualizada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-institutions']);
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
