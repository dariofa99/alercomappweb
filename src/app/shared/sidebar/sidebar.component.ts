import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { UserModel } from 'src/app/core/models/userModel';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})

export class SidebarComponent implements OnInit {
  @Output() alertShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rolespermissionsShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() usersadminShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() institutionsShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() myalertsShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() item: UserModel;
  status_alert: boolean = false;
  status_roles_permissions: boolean = false;
  status_users_admin: boolean = false;
  status_institutions: boolean = false;
  status_my_alerts: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  alertShowingEvent(){
    this.status_alert = true;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.alertShowingUp.emit(true);
    console.log(this.item)
  }

  userShowingEvent(){
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.userShowingUp.emit(true);
  }

  rolespermissionsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = true;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.rolespermissionsShowingUp.emit(true);
  }

  usersadminShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = true;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.usersadminShowingUp.emit(true);
  }

  institutionsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = true;
    this.status_my_alerts = false;
    this.institutionsShowingUp.emit(true);
  }

  myalertsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = true;
    this.myalertsShowingUp.emit(true);
  }

}
