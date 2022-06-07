import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  rememberme: false;
  hidePassword: boolean = true;
  registerForm: FormGroup;
  acceptTermsConditions;

  constructor(private auth: AuthService,private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder) { 
      this.registerForm = this.formBuilder.group({
        name: ['',Validators.required,],
        lastname: ['',Validators.required],
        username: ['',Validators.required,],
        email: ['',Validators.required],
        password: ['',Validators.required,],
        password_confirmation: ['',Validators.required],
        phone_number: ['',Validators.required],
     });
    }

  ngOnInit(): void {
  }

  register(){
    if(this.acceptTermsConditions){
      if(this.registerForm.valid){
        Swal({
          allowOutsideClick: false,
          type: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();
    
        this.auth.newUser(this.registerForm.value).subscribe({
          next: data => {
            Swal.close();
            if(data['errors']!=undefined?data['errors'].length!=0:false){
              data['errors'].map(res => {
                this.toastr.error(res);
              })
            }
            else{
              Swal({
              type: 'info',
              title: 'Importante',
              text: data['messages']
              });
              if ( this.rememberme ) {
                localStorage.setItem('username', this.registerForm.controls['username'].value);
              }
              this.resetRegisterForm(this.registerForm);
            }
          },
          error: error => {
            Swal.close();
            Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
            console.log('There was an error',error)
          }
        });
      }
    }
    else{
      this.toastr.error("Para registrarse debe aceptar Términos y Condiciones");
    }
    
  }

  resetRegisterForm(form: FormGroup){
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }

  openTermsConditions() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/terms-conditions`])
    );
  
    window.open(url, '_blank');
  }

}
