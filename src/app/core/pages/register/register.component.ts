import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  user: UserModel;
  rememberme: false;

  constructor(private auth: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.user = new UserModel();
    this.user.town_id = 1;
    //TODO: Implement departments and towns services to get data from API
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

        if ( this.rememberme ) {
          localStorage.setItem('username', this.user.username);
        }

        this.router.navigateByUrl('/home');
    },(err)=>{
      console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
    });
  }

}
