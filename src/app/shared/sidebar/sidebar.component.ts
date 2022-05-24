import { Component, OnInit, Output, Input, EventEmitter, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserModel } from 'src/app/core/models/userModel';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})

export class SidebarComponent implements OnInit {
  @Input() item: UserModel;
  status_alert: boolean = false;
  status_roles_permissions: boolean = false;
  status_users_admin: boolean = false;
  status_institutions: boolean = false;
  status_eventTypes: boolean = false;
  status_my_alerts: boolean = false;
  status_categories: boolean = false;
  status_institutional_routes: boolean = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
    //console.log(this.item);
  }

  alertShowingEvent(){
    this.status_alert = true;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-alerts/add-alert']);
  }

  userShowingEvent(){
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-users/edit-user',this.item.id]);
  }

  rolespermissionsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = true;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-roles']);
  }

  usersadminShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = true;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-users']);
  }

  institutionsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = true;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-institutions']);
  }

  eventTypesShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = true;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-event-types']);
  }

  categoriesShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = true;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-categories']);
  }

  myalertsShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = true;
    this.status_institutional_routes = false;
    this.router.navigate(['/home/admin-alerts']);
  }

  institutionalRoutesShowingEvent(){
    console.log("Click");
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = true;
    this.router.navigate(['/home/admin-institutional-routes']);
  }

  backHome(){
    this.router.navigate(['/home']);
  }

}
