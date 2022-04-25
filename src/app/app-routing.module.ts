import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ForgotComponent } from './core/pages/forgot/forgot.component';
import { HomeComponent } from './core/pages/home/home.component';
import { LoginComponent } from './core/pages/login/login.component';
import { RegisterComponent } from './core/pages/register/register.component';
import { UserAdminComponent } from './core/pages/user-admin/user-admin.component';
import { UserResolverService } from './core/resolvers/user-resolver.service';
import { UsersResolverService } from './core/resolvers/users-resolver.service';

const routes: Routes = [
  { path: 'home'    , component: HomeComponent, canActivate: [ AuthGuard ],resolve: {users: UsersResolverService,
  user: UserResolverService} },
  { path: 'home/admin-users'    , component: UserAdminComponent, canActivate: [ AuthGuard ] },
  { path: 'register', component: RegisterComponent },
  { path: 'login'   , component: LoginComponent },
  { path: 'forgot'   , component: ForgotComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [UsersResolverService, UserResolverService]
})
export class AppRoutingModule { }
