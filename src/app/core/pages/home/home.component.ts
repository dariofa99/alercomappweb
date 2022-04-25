import { Component, OnInit } from '@angular/core';
import { PermissionsModel } from '../../models/permissionsModel';
import { RoleModel } from '../../models/roleModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { ActivatedRoute, ChildActivationEnd, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { DepartmentModel } from '../../models/departmentModel';
import { TownModel } from '../../models/townModel';
import { ReferencesService } from '../../services/references.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  isOnUser = false;
  isOnAlert = false;
  isOnRolesPermissions = false;
  isOnUsersAdmin = false;
  isOnInstitutions = false;
  isOnMyAlerts = false;

  user: UserModel;
  roles: RoleModel[];
  permissions: PermissionsModel[];
  users: UserModel[];
  departments: DepartmentModel[];
  towns: Array<TownModel[]> = [];
  
  constructor(private references: ReferencesService, private userService: UserService, private auth: AuthService,
    private rolesPermissions:RolesPermissionsService, private route: ActivatedRoute, public router: Router) {

      this.users = this.route.snapshot.data['users'];
      this.user = this.route.snapshot.data['user'];
      this.references.getDepartments(this.auth.readToken()).subscribe({
        next: data=>{this.departments = data;
          this.departments.forEach(element => {
            this.references.getTowns(this.auth.readToken(),element.id).subscribe({
              next: data => {this.towns.push(data)},
              error: error => {console.log('There was an error',error)}
            })
          });},
        error: error => {console.log('There was an error',error)}
      });

      
//      this.user = new UserModel();
    /* this.userService.getUserMe(this.auth.readToken()).subscribe(
       resp => {
         this.user = resp;
         //console.log(resp);
       }
    ); */
    this.rolesPermissions.getRoles(this.auth.readToken()).subscribe(
      resp => {
        //console.log(resp);
        this.roles = resp;
      }
    );
    this.rolesPermissions.getPermissions(this.auth.readToken()).subscribe(
      resp => {
        //console.log(resp);
        this.permissions = resp;
      }
    );

    this.userService.getUsers(this.auth.readToken()).subscribe(
      resp=>{
        //console.log(resp)
        this.users = resp;
      }
    )
  }

  ngOnInit(): void {
    //Read LocalStorage to show active component
    this.isOnUsersAdmin = localStorage.getItem('usersAdmin')=='true'? true : false;
  }

  onalertShowingUp(value){
    console.log("Receipt value on alert")
    this.isOnAlert = value;
    this.isOnUser = false;
    this.isOnRolesPermissions = false;
    this.isOnUsersAdmin = false;
    this.isOnInstitutions = false;
    this.isOnMyAlerts = false;
  }

  onuserShowingUp(value){
    console.log("Receipt value on user")
    this.isOnUser = value;
    this.isOnAlert = false;
    this.isOnRolesPermissions = false;
    this.isOnUsersAdmin = false;
    this.isOnInstitutions = false;
    this.isOnMyAlerts = false;
  }

  onrolespermissionsShowingUp(value){
    console.log("Receipt value on roles permissions")
    this.isOnRolesPermissions = value;
    this.isOnUser = false;
    this.isOnAlert = false;
    this.isOnUsersAdmin = false;
    this.isOnInstitutions = false;
    this.isOnMyAlerts = false;
  }

  onusersadminShowingUp(value){
    console.log("Receipt value on users admin")
    localStorage.setItem('usersAdmin', value);
    this.isOnUsersAdmin = value;
    this.isOnUser = false;
    this.isOnAlert = false;
    this.isOnRolesPermissions = false;
    this.isOnInstitutions = false;
    this.isOnMyAlerts = false;
  }

  oninstitutionsShowingUp(value){
    console.log("Receipt value on institutions")
    this.isOnInstitutions = value;
    this.isOnUser = false;
    this.isOnAlert = false;
    this.isOnRolesPermissions = false;
    this.isOnUsersAdmin = false;
    this.isOnMyAlerts = false;
  }

  onmyalertsShowingUp(value){
    console.log("Receipt value on my alerts")
    this.isOnMyAlerts = value;
    this.isOnUser = false;
    this.isOnAlert = false;
    this.isOnRolesPermissions = false;
    this.isOnUsersAdmin = false;
    this.isOnInstitutions = false;
  }

  showComponent(value,component){
    this.isOnAlert = false;
    this.isOnUser = false;
    this.isOnRolesPermissions = false;
    this.isOnUsersAdmin = false;
    this.isOnInstitutions = false;
    this.isOnMyAlerts = false;
    switch(component){
      case "isOnAlert":
        this.isOnAlert = value;
        break;
      case "isOnUser":
    }
  }

}
