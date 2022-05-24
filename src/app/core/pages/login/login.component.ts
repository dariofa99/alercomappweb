import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  rememberme = false;

  constructor(private auth: AuthService,private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder) { 
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required,],
      password: ['',Validators.required],
   });
  }

  ngOnInit(): void {
  }

  login() {

    if (  this.loginForm.valid ) { 
      Swal({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
  
  
      this.auth.login( this.loginForm.value ).subscribe({
        next: data => {
          console.log(data)
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal.close();
            if ( this.rememberme ) {
              localStorage.setItem('username', data['user'].username);
            }
            localStorage.setItem('userID', data['user'].id);
            localStorage.setItem('token', data['access_token']);
            this.router.navigateByUrl('/home');
          }
          
        },
        error: error => {
          Swal({text:error.error.error, type:'error'})  
          console.log('There was an error',error)
        }
      });
     }

  }
}
