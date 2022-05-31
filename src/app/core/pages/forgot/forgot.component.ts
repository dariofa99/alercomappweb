import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styles: [
  ]
})
export class ForgotComponent implements OnInit {

  forgotForm: FormGroup;

  constructor(private auth: AuthService,private router: Router,
    private toastr: ToastrService,private formBuilder: FormBuilder) {
      this.forgotForm = this.formBuilder.group({
        email: ['',Validators.required],
     });
  }

  ngOnInit(): void {
  }

  forgot() {

    if(this.forgotForm.valid){
      Swal({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
  
      this.auth.forgot(this.forgotForm.value).subscribe({
        next: data => {
          Swal.close();
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
              this.resetForgotForm(this.forgotForm);
            })
          }
          else{
            Swal({
            type: 'info',
            title: 'Importante',
            text: data['messages']
            });
            this.resetForgotForm(this.forgotForm);
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

  resetForgotForm(form: FormGroup){
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }

}
