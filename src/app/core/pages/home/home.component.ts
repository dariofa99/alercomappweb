import { Component, OnInit } from '@angular/core';
import { PermissionsModel } from '../../models/permissionsModel';
import { RoleModel } from '../../models/roleModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';

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

  constructor(private userService: UserService, private auth: AuthService,
    private rolesPermissions:RolesPermissionsService) {
    this.user = new UserModel();
    this.userService.getUserMe(this.auth.readToken()).subscribe(
       resp => {
         this.user = resp;
         //console.log(resp);
       }
    );
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

}
