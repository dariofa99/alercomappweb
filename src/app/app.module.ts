import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { ForgotComponent } from './core/pages/forgot/forgot.component';
import { NewEditAlertComponent } from './core/pages/new-edit-alert/new-edit-alert.component';
import { RolesPermissionsComponent } from './core/pages/roles-permissions/roles-permissions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ArrowDivDirective } from './core/directives/arrow-div.directive';
import { KeyBoardService } from './core/services/keyboard.service';
import { UserAdminComponent } from './core/pages/user-admin/user-admin.component';
import { MyalertsComponent } from './core/pages/myalerts/myalerts.component';
import { InstitutionsComponent } from './core/pages/institutions/institutions.component';
import { NewEditUserComponent } from './core/pages/new-edit-user/new-edit-user.component';
import { NewEditRoleComponent } from './core/pages/new-edit-role/new-edit-role.component';
import { NewEditPermissionComponent } from './core/pages/new-edit-permission/new-edit-permission.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NewEditInstitutionComponent } from './core/pages/new-edit-institution/new-edit-institution.component';
import { NewEditTypealertComponent } from './core/pages/new-edit-typealert/new-edit-typealert.component';
import { TypealertsComponent } from './core/pages/typealerts/typealerts.component';
import { DetailAlertComponent } from './core/pages/detail-alert/detail-alert.component';
import { NewEditCategoryComponent } from './core/pages/new-edit-category/new-edit-category.component';
import { CategoriesComponent } from './core/pages/categories/categories.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { InstitutionalRoutesComponent } from './core/pages/institutional-routes/institutional-routes.component';
import { NewEditInstitutionalRouteComponent } from './core/pages/new-edit-institutional-route/new-edit-institutional-route.component';
import { ChangeStatusDialogComponent } from './core/pages/change-status-dialog/change-status-dialog.component';
import { ConfirmAccountComponent } from './core/pages/confirm-account/confirm-account.component';
import { RecoveryPasswordComponent } from './core/pages/recovery-password/recovery-password.component';
import { ViewAlertComponent } from './core/pages/view-alert/view-alert.component';
import { NewEditInstitutionInfoComponent } from './core/pages/new-edit-institution-info/new-edit-institution-info.component';
import { InstitutionsInfoComponent } from './core/pages/institutions-info/institutions-info.component';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { LoadPermissionsService } from './core/services/load-permissions.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MarkerGoogleMaps } from './core/const/markerGoogleMaps';
import { PermissionsList } from './core/const/permissionsList';
import { ForbiddenComponent } from './core/pages/forbidden/forbidden.component';
import { TermsConditionsComponent } from './core/pages/terms-conditions/terms-conditions.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChangeRoleDialogComponent } from './core/pages/change-rol-dialog/change-role-dialog.component';
import { AlertsComponent } from './core/pages/alerts/alerts.component';
import { UserProfileComponent } from './core/pages/user-profile/user-profile.component';
import { StatusList } from './core/const/statusList';
import { GoogleMaps } from './core/const/googleMaps';

export function permissionsFactory(
  loadPermissionsService: LoadPermissionsService,
  ngxPermissionsService: NgxPermissionsService
) {
  return () => {
    return loadPermissionsService
      .loadPermissions()
      .then((data: [string]) => {
        ngxPermissionsService.loadPermissions(data);
        return true;
      })
      .catch((data) => {
      });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotComponent,
    NewEditAlertComponent,
    RolesPermissionsComponent,
    ArrowDivDirective,
    UserAdminComponent,
    MyalertsComponent,
    InstitutionsComponent,
    NewEditUserComponent,
    NewEditRoleComponent,
    NewEditPermissionComponent,
    NewEditInstitutionComponent,
    NewEditTypealertComponent,
    TypealertsComponent,
    DetailAlertComponent,
    NewEditCategoryComponent,
    CategoriesComponent,
    InstitutionalRoutesComponent,
    NewEditInstitutionalRouteComponent,
    ChangeStatusDialogComponent,
    ConfirmAccountComponent,
    RecoveryPasswordComponent,
    ViewAlertComponent,
    NewEditInstitutionInfoComponent,
    InstitutionsInfoComponent,
    ForbiddenComponent,
    TermsConditionsComponent,
    ChangeRoleDialogComponent,
    AlertsComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule.forRoot(),
    GoogleMapsModule,
    NgxPermissionsModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [
    RolesPermissionsComponent,
    KeyBoardService,
    PermissionsList,
    StatusList,
    GoogleMaps,
    MarkerGoogleMaps,
    {
      provide: APP_INITIALIZER,
      useFactory: permissionsFactory,
      deps: [LoadPermissionsService, NgxPermissionsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
