import { Component, OnInit } from '@angular/core';
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

  departments: DepartmentModel[];
  towns: TownModel[];
  eventTypes: EventTypeModel[] = [];
  isDeparmentSelected = false;
  public contactElements:Array<unknown> = [];

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
    this.contactElements = [...this.contactElements, this.contactElements.length + 1];
  }

  onEventTypeSelected(event: any){
    
  }

  onContactTypeSelected(event: any){

  }

}
