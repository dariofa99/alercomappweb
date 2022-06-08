import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomAddCategoryGuard } from './core/guards/custom-add-category.guard';
import { CustomAddEditPermissionGuard } from './core/guards/custom-add-edit-permission.guard';
import { CustomAddEditRoleGuard } from './core/guards/custom-add-edit-role.guard';
import { CustomAddInstitutionInfoGuard } from './core/guards/custom-add-institution-info.guard';
import { CustomAddInstitutionGuard } from './core/guards/custom-add-institution.guard';
import { CustomAddInstitutionalRouteGuard } from './core/guards/custom-add-institutional-route.guard';
import { CustomAddTypeAlertGuard } from './core/guards/custom-add-type-alert.guard';
import { CustomAddUserGuard } from './core/guards/custom-add-user.guard';
import { CustomAdminCategoriesGuard } from './core/guards/custom-admin-categories.guard';
import { CustomAdminInstitutionalRoutesGuard } from './core/guards/custom-admin-institutional-routes.guard';
import { CustomAdminInstitutionsInfoGuard } from './core/guards/custom-admin-institutions-info.guard';
import { CustomAdminInstitutionsGuard } from './core/guards/custom-admin-institutions.guard';
import { CustomAdminRolesGuard } from './core/guards/custom-admin-roles.guard';
import { CustomAdminTypeAlertsGuard } from './core/guards/custom-admin-type-alerts.guard';
import { CustomAdminUsersGuard } from './core/guards/custom-admin-users.guard';
import { CustomEditCategoryGuard } from './core/guards/custom-edit-category.guard';
import { CustomEditInstitutionInfoGuard } from './core/guards/custom-edit-institution-info.guard';
import { CustomEditInstitutionGuard } from './core/guards/custom-edit-institution.guard';
import { CustomEditInstitutionalRouteGuard } from './core/guards/custom-edit-institutional-route.guard';
import { CustomEditTypeAlertGuard } from './core/guards/custom-edit-type-alert.guard';
import { CustomEditUserGuard } from './core/guards/custom-edit-user.guard';
import { AlertsComponent } from './core/pages/alerts/alerts.component';
import { CategoriesComponent } from './core/pages/categories/categories.component';
import { ConfirmAccountComponent } from './core/pages/confirm-account/confirm-account.component';
import { DetailAlertComponent } from './core/pages/detail-alert/detail-alert.component';
import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';
import { ForgotComponent } from './core/pages/forgot/forgot.component';
import { HomeComponent } from './core/pages/home/home.component';
import { InstitutionalRoutesComponent } from './core/pages/institutional-routes/institutional-routes.component';
import { InstitutionsInfoComponent } from './core/pages/institutions-info/institutions-info.component';
import { InstitutionsComponent } from './core/pages/institutions/institutions.component';
import { LoginComponent } from './core/pages/login/login.component';
import { MyalertsComponent } from './core/pages/myalerts/myalerts.component';
import { NewEditAlertComponent } from './core/pages/new-edit-alert/new-edit-alert.component';
import { NewEditCategoryComponent } from './core/pages/new-edit-category/new-edit-category.component';
import { NewEditInstitutionInfoComponent } from './core/pages/new-edit-institution-info/new-edit-institution-info.component';
import { NewEditInstitutionComponent } from './core/pages/new-edit-institution/new-edit-institution.component';
import { NewEditInstitutionalRouteComponent } from './core/pages/new-edit-institutional-route/new-edit-institutional-route.component';
import { NewEditPermissionComponent } from './core/pages/new-edit-permission/new-edit-permission.component';
import { NewEditRoleComponent } from './core/pages/new-edit-role/new-edit-role.component';
import { NewEditTypealertComponent } from './core/pages/new-edit-typealert/new-edit-typealert.component';
import { NewEditUserComponent } from './core/pages/new-edit-user/new-edit-user.component';
import { RecoveryPasswordComponent } from './core/pages/recovery-password/recovery-password.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { RolesPermissionsComponent } from './core/pages/roles-permissions/roles-permissions.component';
import { TermsConditionsComponent } from './core/pages/terms-conditions/terms-conditions.component';
import { TypealertsComponent } from './core/pages/typealerts/typealerts.component';
import { UserAdminComponent } from './core/pages/user-admin/user-admin.component';
import { ViewAlertComponent } from './core/pages/view-alert/view-alert.component';
import { AffectsRangeResolverService } from './core/resolvers/affectsRanges-resolver.service';
import { AlertByIDResolverService } from './core/resolvers/alert-byid-resolver.service';
import { AlertByTokenResolverService } from './core/resolvers/alert-bytoken-resolver.service';
import { AlertsResolverService } from './core/resolvers/alerts-resolver.service';
import { CategoriesResolverService } from './core/resolvers/categories-resolver.service';
import { CategoryByIDResolverService } from './core/resolvers/category-byid-resolver.service';
import { DepartmentsResolverService } from './core/resolvers/departments-resolver.service';
import { EventTypeByIDResolverService } from './core/resolvers/eventType-byid-resolver.service';
import { EventTypesResolverService } from './core/resolvers/eventTypes-resolver.service';
import { InstitutionByIDResolverService } from './core/resolvers/institution-byid-resolver.service';
import { InstitutionalRouteByIDResolverService } from './core/resolvers/institutional-route-byid-resolver.service';
import { InstitutionalRoutesResolverService } from './core/resolvers/institutional-routes-resolver.service';
import { InstitutionInfoByIDResolverService } from './core/resolvers/institutioninfo-byid-resolver.service';
import { InstitutionsResolverService } from './core/resolvers/institutions-resolver.service';
import { InstitutionsInfoResolverService } from './core/resolvers/institutionsinfo-resolver.service';
import { PermissionsResolverService } from './core/resolvers/permissions-resolver.service';
import { RolesResolverService } from './core/resolvers/roles-resolver.service';
import { TownsResolverService } from './core/resolvers/towns-resolver.service';
import { UserByIDResolverService } from './core/resolvers/user-byid-resolver.service';
import { UserResolverService } from './core/resolvers/user-resolver.service';
import { UsersResolverService } from './core/resolvers/users-resolver.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      users: UsersResolverService,
      user: UserResolverService,
    },
  },

  {
    path: 'home/admin-users',
    component: UserAdminComponent,
    canActivate: [CustomAdminUsersGuard],
    resolve: {
      departments: DepartmentsResolverService,
      users: UsersResolverService,
      user: UserResolverService,
      towns: TownsResolverService,
    },
    data: {
      permissions: {
        readUser: ['ver_usuarios'],
        createUser: ['crear_usuarios'],
        editUser: ['editar_usuarios'],
        deleteUser: ['eliminar_usuarios'],
      },
    },
  },

  {
    path: 'home/admin-users/add-user',
    component: NewEditUserComponent,
    canActivate: [CustomAddUserGuard],
    resolve: {
      departments: DepartmentsResolverService,
      user: UserResolverService,
      towns: TownsResolverService,
    },
    data: {
      permissions: {
        createUser: ['crear_usuarios'],
      },
    },
  },

  {
    path: 'home/admin-users/edit-user/:id',
    component: NewEditUserComponent,
    canActivate: [AuthGuard],
    resolve: {
      users: UsersResolverService,
      departments: DepartmentsResolverService,
      user: UserResolverService,
      userByID: UserByIDResolverService,
      towns: TownsResolverService,
    },
    data: {
      permissions: {
        editUser: ['editar_usuarios'],
      },
    },
  },
  {
    path: 'home/admin-roles',
    component: RolesPermissionsComponent,
    canActivate: [AuthGuard],
    resolve: {
      permissions: PermissionsResolverService,
      roles: RolesResolverService,
      user: UserResolverService,
    },
    data: {
      permissions: {
        readRole: ['ver_roles'],
        createRole: ['crear_roles'],
        editRole: ['editar_roles'],
        deleteRole: ['eliminar_roles'],
        readPermission: ['ver_permisos'],
        createPermission: ['crear_permisos'],
        editPermission: ['editar_permisos'],
        deletePermission: ['eliminar_permisos'],
      },
    },
  },
  {
    path: 'home/admin-roles/add-edit-rol',
    component: NewEditRoleComponent,
    canActivate: [CustomAddEditRoleGuard],
    resolve: {
      user: UserResolverService,
      roles: RolesResolverService,
    },
    data: {
      permissions: {
        readRole: ['ver_roles'],
        createRole: ['crear_roles'],
        editRole: ['editar_roles'],
        deleteRole: ['eliminar_roles'],
      },
    },
  },
  {
    path: 'home/admin-roles/add-edit-permission',
    component: NewEditPermissionComponent,
    canActivate: [CustomAddEditPermissionGuard],
    resolve: {
      user: UserResolverService,
      permissions: PermissionsResolverService,
    },
    data: {
      permissions: {
        readPermission: ['ver_permisos'],
        createPermission: ['crear_permisos'],
        editPermission: ['editar_permisos'],
        deletePermission: ['eliminar_permisos'],
      },
    },
  },
  {
    path: 'home/admin-institutions',
    component: InstitutionsComponent,
    canActivate: [CustomAdminInstitutionsGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      institutions: InstitutionsResolverService,
    },
    data: {
      permissions: {
        readInstitution: ['ver_instituciones'],
        createInstitution: ['crear_instituciones'],
        editInstitution: ['editar_instituciones'],
        deleteInstitution: ['eliminar_instituciones'],
      },
    },
  },
  {
    path: 'home/admin-institutions/add-institution',
    component: NewEditInstitutionComponent,
    canActivate: [CustomAddInstitutionGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      eventTypes: EventTypesResolverService,
    },
    data: {
      permissions: {
        createInstitution: ['crear_instituciones'],
      },
    },
  },
  {
    path: 'home/admin-institutions/edit-institution/:id',
    component: NewEditInstitutionComponent,
    canActivate: [CustomEditInstitutionGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      institutionByID: InstitutionByIDResolverService,
      eventTypes: EventTypesResolverService,
    },
    data: {
      permissions: {
        editInstitution: ['editar_instituciones'],
      },
    },
  },
  {
    path: 'home/admin-institutions-info',
    component: InstitutionsInfoComponent,
    canActivate: [CustomAdminInstitutionsInfoGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      institutionsinfo: InstitutionsInfoResolverService,
    },
    data: {
      permissions: {
        readInstitutionInfo: ['ver_instituciones_info'],
        createInstitutionInfo: ['crear_instituciones_info'],
        editInstitutionInfo: ['editar_instituciones_info'],
        deleteInstitutionInfo: ['eliminar_instituciones_info'],
      },
    },
  },
  {
    path: 'home/admin-institutions-info/add-institution-info',
    component: NewEditInstitutionInfoComponent,
    canActivate: [CustomAddInstitutionInfoGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
    },
    data: {
      permissions: {
        createInstitutionInfo: ['crear_instituciones_info'],
      },
    },
  },
  {
    path: 'home/admin-institutions-info/edit-institution-info/:id',
    component: NewEditInstitutionInfoComponent,
    canActivate: [CustomEditInstitutionInfoGuard],
    resolve: {
      user: UserResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      institutionInfoByID: InstitutionInfoByIDResolverService,
    },
    data: {
      permissions: {
        editInstitutionInfo: ['editar_instituciones_info'],
      },
    },
  },
  {
    path: 'home/admin-my-alerts',
    component: MyalertsComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
      affectRanges: AffectsRangeResolverService,
      users: UsersResolverService,
    },
  },
  {
    path: 'home/admin-alerts',
    component: AlertsComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
      affectRanges: AffectsRangeResolverService,
      users: UsersResolverService,
    },
    data: {
      permissions: {
        changeStateEvent: ['cambiar_estado_alerta'],
      },
    }
  },
  {
    path: 'home/admin-alerts/alert-detail/:id',
    component: DetailAlertComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
      affectRanges: AffectsRangeResolverService,
      alertByID: AlertByIDResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      categories: CategoriesResolverService,
    },
  },
  {
    path: 'view/alert/:token',
    component: ViewAlertComponent,
    resolve: {
      alertByToken: AlertByTokenResolverService,
    },
  },
  {
    path: 'home/admin-alerts/add-alert',
    component: NewEditAlertComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
      affectRanges: AffectsRangeResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      categories: CategoriesResolverService,
    },
  },
  {
    path: 'home/admin-alerts/edit-alert/:id',
    component: NewEditAlertComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
      affectRanges: AffectsRangeResolverService,
      towns: TownsResolverService,
      departments: DepartmentsResolverService,
      alertByID: AlertByIDResolverService,
      categories: CategoriesResolverService,
    },
  },
  {
    path: 'home/admin-event-types',
    component: TypealertsComponent,
    canActivate: [CustomAdminTypeAlertsGuard],
    resolve: {
      user: UserResolverService,
      eventTypes: EventTypesResolverService,
    },
    data: {
      permissions: {
        readTypeAlert: ['ver_tipos_alertas'],
        createTypeAlert: ['crear_tipos_alertas'],
        editTypeAlert: ['editar_tipos_alertas'],
        deleteTypeAlert: ['eliminar_tipos_alertas'],
      },
    },
  },
  {
    path: 'home/admin-event-types/add-event-type',
    component: NewEditTypealertComponent,
    canActivate: [CustomAddTypeAlertGuard],
    resolve: {
      user: UserResolverService,
      categories: CategoriesResolverService,
    },
    data: {
      permissions: {
        createTypeAlert: ['crear_tipos_alertas'],
      },
    },
  },
  {
    path: 'home/admin-event-types/edit-event-type/:id',
    component: NewEditTypealertComponent,
    canActivate: [CustomEditTypeAlertGuard],
    resolve: {
      user: UserResolverService,
      categories: CategoriesResolverService,
      eventTypeByID: EventTypeByIDResolverService,
    },
    data: {
      permissions: {
        editTypeAlert: ['editar_tipos_alertas'],
      },
    },
  },
  {
    path: 'home/admin-categories',
    component: CategoriesComponent,
    canActivate: [CustomAdminCategoriesGuard],
    resolve: {
      user: UserResolverService,
      categories: CategoriesResolverService,
    },
    data: {
      permissions: {
        readCategory: ['ver_categorias'],
        createCategory: ['crear_categorias'],
        editCategory: ['editar_categorias'],
        deleteCategory: ['eliminar_categorias'],
      },
    },
  },
  {
    path: 'home/admin-categories/add-category',
    component: NewEditCategoryComponent,
    canActivate: [CustomAddCategoryGuard],
    resolve: {
      user: UserResolverService,
    },
    data: {
      permissions: {
        createCategory: ['crear_categorias'],
      },
    },
  },
  {
    path: 'home/admin-categories/edit-category/:id',
    component: NewEditCategoryComponent,
    canActivate: [CustomEditCategoryGuard],
    resolve: {
      user: UserResolverService,
      categoryByID: CategoryByIDResolverService,
    },
    data: {
      permissions: {
        editCategory: ['editar_categorias'],
      },
    },
  },
  {
    path: 'home/admin-institutional-routes',
    component: InstitutionalRoutesComponent,
    canActivate: [CustomAdminInstitutionalRoutesGuard],
    resolve: {
      user: UserResolverService,
      institutionalRoutes: InstitutionalRoutesResolverService,
    },
    data: {
      permissions: {
        readInstitutionalRoute: ['ver_rutas_institucionales'],
        createInstitutionalRoute: ['crear_rutas_institucionales'],
        editInstitutionalRoute: ['editar_rutas_institucionales'],
        deleteInstitutionalRoute: ['eliminar_rutas_institucionales'],
      },
    },
  },
  {
    path: 'home/admin-institutional-routes/add-institutional-route',
    component: NewEditInstitutionalRouteComponent,
    canActivate: [CustomAddInstitutionalRouteGuard],
    resolve: {
      user: UserResolverService,
    },
    data: {
      permissions: {
        createInstitutionalRoute: ['crear_rutas_institucionales'],
      },
    },
  },
  {
    path: 'home/admin-institutiona-routes/edit-institutional-route/:id',
    component: NewEditInstitutionalRouteComponent,
    canActivate: [CustomEditInstitutionalRouteGuard],
    resolve: {
      user: UserResolverService,
      institutionalRouteByID: InstitutionalRouteByIDResolverService,
    },
    data: {
      permissions: {
        editInstitutionalRoute: ['editar_rutas_institucionales'],
      },
    },
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'terms/conditions', component: TermsConditionsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm/account/:token', component: ConfirmAccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset/password/:token', component: RecoveryPasswordComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    UsersResolverService,
    UserResolverService,
    DepartmentsResolverService,
    PermissionsResolverService,
    RolesResolverService,
  ],
})
export class AppRoutingModule {}
