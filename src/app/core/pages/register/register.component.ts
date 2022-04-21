import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterModel } from '../../models/userRegisterModel';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  user: UserRegisterModel;
  rememberme: false;

  constructor(private auth: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.user = new UserRegisterModel();
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
