import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { TownModel } from '../../models/townModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styles: [
  ]
})
export class InstitutionsComponent implements OnInit {


  @ViewChild('contactType') contactType; 
  @ViewChild('inputContact') inputContact;
  @ViewChild('eventType') eventType; 

  departments: DepartmentModel[];
  towns: TownModel[];
  eventTypes: EventTypeModel[] = [];
  isDeparmentSelected = false;
  contacts = [];
  contact_type_id = [];
  event_types_names = [];
  event_types = [];

  constructor(private auth: AuthService, private alertService: AlertsService, private references: ReferencesService) { }

  ngOnInit(): void {
    this.references.getDepartments(this.auth.readToken()).subscribe(resp=>{
      this.departments = resp;
    });

    this.alertService.getEventTypes(this.auth.readToken()).subscribe((
      resp=>{
        console.log(resp);
        this.eventTypes = resp;
      }
    ))
  }
  
  onDepartmentSelected(event: any){
    this.references.getTowns(this.auth.readToken(),event.target.value).subscribe(resp=>{
      this.towns = resp;
      this.isDeparmentSelected = true;
    });
  }

  onAddContact(){
    if(this.contactType.nativeElement.value!="" && this.inputContact.nativeElement.value!=""){
      this.contacts.push(this.inputContact.nativeElement.value)
      this.contact_type_id.push(this.contactType.nativeElement.value)
    }
  }

  onAddEventType(){
    console.log(this.eventType.nativeElement.value)
    if(this.eventType.nativeElement.value!=""){
      this.event_types.push(this.eventType.nativeElement.value)
      this.event_types_names.push(this.eventType.nativeElement.options[this.eventType.nativeElement.selectedIndex].innerText)
    }
  }

  onEventTypeSelected(event: any){
    
  }

  onContactTypeSelected(event: any){

  }

  removeFromList(obj){
    console.log("obj", obj);
    let index: number = this.contacts.findIndex(item => item === obj);
    if (index > -1) {
      this.contacts.splice(index, 1);
    }
  }

}
