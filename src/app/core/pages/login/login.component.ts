import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { UserModel } from '../../models/userModel';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  rememberme = false;

  constructor(private auth: AuthService,private router: Router) { }

  ngOnInit(): void {
  }

  login( form: NgForm ) {

    if (  form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.auth.login( this.user )
      .subscribe( resp => {

        console.log(resp);
        Swal.close();

        if ( this.rememberme ) {
          localStorage.setItem('email', this.user.username);
        }

        this.router.navigateByUrl('/home');

      }, (err) => {

        console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error authenticating',
          text: err.error.error.message
        });
      });

  }

}
