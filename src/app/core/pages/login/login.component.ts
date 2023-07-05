import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  rememberme = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      Swal({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...',
      });
      Swal.showLoading();

      this.auth.login(this.loginForm.value).subscribe({
        next: (data) => {
          Swal.close();
          if (
            data['errors'] != undefined ? data['errors'].length != 0 : false
          ) {
            data['errors'].map((res) => {
              this.toastr.error(res);
            });
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('permissions');
          } else {
            if (this.rememberme) {
              this.auth.saveItemLS('username',data['user'].username);              
            }
            let now = new Date();
            now.setSeconds( 3600 );
            this.auth.saveItemLS('userID',data['user'].id);
            this.auth.saveItemLS('token',data['access_token']);
            this.auth.readToken();
            this.auth.saveItemLS('expire',now.getTime().toString());
            this.auth.savePermissions(data['permissions']);
            this.router.navigateByUrl('/home');
            //console.log(this.auth.readToken());
            

          }
        },
        error: (error) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('permissions');
          Swal({text:error, type:'error'})
          console.log('There was an error', error);
        },
      });
    }
  }

}
