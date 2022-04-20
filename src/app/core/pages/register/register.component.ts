import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterModel } from '../../models/userRegisterModel';

import Swal from 'sweetalert2';
import { ReferencesService } from '../../services/references.service';
import { DepartmentModel } from '../../models/departmentModel';
import { TownModel } from '../../models/townModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  user: UserRegisterModel;
  rememberme: false;
  departments: DepartmentModel[];
  towns: TownModel[];
  isDeparmentSelected = false;

  constructor(private auth: AuthService,private router: Router, private references: ReferencesService) { }

  ngOnInit(): void {
    this.user = new UserRegisterModel();
    //TODO: Implement departments and towns services to get data from API
    this.references.getDepartments(this.auth.readToken()).subscribe(resp=>{
      this.departments = resp;
    });
  }

  onDepartmentSelected(event: any){
    this.references.getTowns(this.auth.readToken(),event.target.value).subscribe(resp=>{
      this.towns = resp;
      this.isDeparmentSelected = true;
    });
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.newUser(this.user)
    .subscribe(resp=>{
      console.log(resp);
        Swal.close();
        Swal.fire({
          icon: 'info',
          title: 'Message Info',
          text: resp['messages']
        });
        if ( this.rememberme ) {
          localStorage.setItem('username', this.user.username);
        }

        this.router.navigateByUrl('/home');
    },(err)=>{
      console.log(err);
      Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error
        });
    });
  }

}
