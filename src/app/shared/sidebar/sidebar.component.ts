import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  NgModule,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from 'src/app/core/const/permissionsList';
import { UserModel } from 'src/app/core/models/userModel';
import { LoadPermissionsService } from 'src/app/core/services/load-permissions.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  @Input() item: UserModel;
  status_alert: boolean = false;
  status_roles_permissions: boolean = false;
  status_users_admin: boolean = false;
  status_institutions: boolean = false;
  status_institutions_info: boolean = false;
  status_eventTypes: boolean = false;
  status_my_alerts: boolean = false;
  status_categories: boolean = false;
  status_institutional_routes: boolean = false;
  status_alerts: boolean = false;
  permissionCreateEvent = "";
  permissionsUsers = [];
  permissionEvents = [];
  permissionsRoles = [];
  permissionsInstitutions = [];
  permissionsInstitutionsInfo = [];
  permissionsTypeAlerts = [];
  permissionsEventTypes = [];
  permissionsCategories = [];
  permissionsInstitutionalRoutes = [];
  permissionsGroupUsers = [];
  permissionsGroupEvents = [];
  changeStateEvent;
  hasChangeStateEvent = false;

  constructor(
    public router: Router,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.permissionsUsers.push(this.permissionsList.VER_USUARIOS);
    this.permissionsUsers.push(this.permissionsList.CREAR_USUARIOS);
    this.permissionsUsers.push(this.permissionsList.EDITAR_USUARIOS);
    this.permissionsUsers.push(this.permissionsList.ELIMINAR_USUARIOS);

    this.permissionsRoles.push(this.permissionsList.VER_ROLES);
    this.permissionsRoles.push(this.permissionsList.CREAR_ROLES);
    this.permissionsRoles.push(this.permissionsList.EDITAR_ROLES);
    this.permissionsRoles.push(this.permissionsList.ELIMINAR_ROLES);
    this.permissionsRoles.push(this.permissionsList.VER_PERMISOS);
    this.permissionsRoles.push(this.permissionsList.CREAR_PERMISOS);
    this.permissionsRoles.push(this.permissionsList.EDITAR_PERMISOS);
    this.permissionsRoles.push(this.permissionsList.ELIMINAR_PERMISOS);

    this.permissionsInstitutions.push(this.permissionsList.VER_INSTITUCIONES);
    this.permissionsInstitutions.push(this.permissionsList.CREAR_INSTITUCIONES);
    this.permissionsInstitutions.push(this.permissionsList.EDITAR_INSTITUCIONES);
    this.permissionsInstitutions.push(this.permissionsList.ELIMINAR_INSTITUCIONES);

    this.permissionsInstitutionsInfo.push(this.permissionsList.VER_INSTITUCIONES_INFO);
    this.permissionsInstitutionsInfo.push(this.permissionsList.CREAR_INSTITUCIONES_INFO);
    this.permissionsInstitutionsInfo.push(this.permissionsList.EDITAR_INSTITUCIONES);
    this.permissionsInstitutionsInfo.push(this.permissionsList.ELIMINAR_INSTITUCIONES_INFO);

    this.permissionsEventTypes.push(this.permissionsList.VER_TIPOS_ALERTAS);
    this.permissionsEventTypes.push(this.permissionsList.CREAR_TIPOS_ALERTAS);
    this.permissionsEventTypes.push(this.permissionsList.EDITAR_TIPOS_ALERTAS);
    this.permissionsEventTypes.push(this.permissionsList.ELIMINAR_TIPOS_ALERTAS);

    this.permissionsCategories.push(this.permissionsList.VER_CATEGORIAS);
    this.permissionsCategories.push(this.permissionsList.CREAR_CATEGORIAS);
    this.permissionsCategories.push(this.permissionsList.EDITAR_CATEGORIAS);
    this.permissionsCategories.push(this.permissionsList.ELIMINAR_CATEGORIAS);

    this.permissionsInstitutionalRoutes.push(this.permissionsList.VER_RUTAS_INSTITUCIONALES);
    this.permissionsInstitutionalRoutes.push(this.permissionsList.CREAR_RUTAS_INSTITUCIONALES);
    this.permissionsInstitutionalRoutes.push(this.permissionsList.EDITAR_RUTAS_INSTITUCIONALES);
    this.permissionsInstitutionalRoutes.push(this.permissionsList.ELIMINAR_RUTAS_INSTITUCIONALES);

    this.permissionEvents.push(this.permissionsList.VER_ALERTAS);
    this.permissionEvents.push(this.permissionsList.EDITAR_ALERTAS);
    this.permissionEvents.push(this.permissionsList.ELIMINAR_ALERTAS);
    this.permissionEvents.push(this.permissionsList.CAMBIAR_ESTADO_ALERTA);
    this.permissionCreateEvent = this.permissionsList.CREAR_ALERTAS;
    this.changeStateEvent = this.permissionsList.CAMBIAR_ESTADO_ALERTA;

    this.permissionsRoles.forEach(element => {
      this.permissionsGroupUsers.push(element);
    });

    this.permissionsUsers.forEach(element => {
      this.permissionsGroupUsers.push(element);
    });

    this.permissionsInstitutions.forEach(element => {
      this.permissionsGroupUsers.push(element);
    });

    this.permissionsInstitutionsInfo.forEach(element => {
      this.permissionsGroupUsers.push(element);
    });

    this.permissionsCategories.forEach(element => {
      this.permissionsGroupEvents.push(element);
    });

    this.permissionsEventTypes.forEach(element => {
      this.permissionsGroupEvents.push(element);
    });

    this.permissionsInstitutionalRoutes.forEach(element => {
      this.permissionsGroupEvents.push(element);
    });

    this.permissionEvents.forEach(element => {
      this.permissionsGroupEvents.push(element);
    });

    this.permissionsGroupEvents.push(this.permissionCreateEvent);

    this.ngxPermissionsService
      .hasPermission(this.changeStateEvent)
      .then((result) => {
        this.hasChangeStateEvent = result;
      });
  }

  ngOnInit(): void {
  }

  alertShowingEvent() {
    this.status_alerts = false;
    this.status_alert = true;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-alerts/add-alert']);
  }

  userShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-users/edit-user', this.item.id]);
  }

  rolespermissionsShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = true;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-roles']);
  }

  usersadminShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-users']);
  }

  institutionsShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = true;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-institutions']);
  }

  institutionsInfoShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = true;
    this.router.navigate(['/home/admin-institutions-info']);
  }

  eventTypesShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-event-types']);
  }

  categoriesShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-categories']);
  }

  myalertsShowingEvent() {
    this.status_alerts = false;
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = true;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.router.navigate(['/home/admin-my-alerts']);
  }

  alertsShowingEvent() {
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutional_routes = false;
    this.status_institutions_info = false;
    this.status_alerts = true;
    this.router.navigate(['/home/admin-alerts']);
  }

  institutionalRoutesShowingEvent() {
    this.status_alert = false;
    this.status_roles_permissions = false;
    this.status_users_admin = false;
    this.status_institutions = false;
    this.status_my_alerts = false;
    this.status_institutions_info = false;
    this.status_institutional_routes = true;
    this.router.navigate(['/home/admin-institutional-routes']);
  }

  backHome() {
    this.router.navigate(['/home']);
  }
}
