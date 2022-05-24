import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styles: [
  ]
})
export class RecoveryPasswordComponent implements OnInit {
  
  recoveryForm : FormGroup;
  hidePassword: boolean = true;

  constructor(private auth: AuthService,private router: Router,
    private toastr: ToastrService,private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
      this.recoveryForm = this.formBuilder.group({
        remember_token: ['',Validators.required],
        email: ['',Validators.required],
        password: ['',Validators.required],
        password_confirmation: ['',Validators.required],
     });
     this.recoveryForm.controls['remember_token'].setValue(this.route.snapshot.params['token']);
     }

  ngOnInit(): void {
  }

  recoveryPassword( ) {

    if(this.recoveryForm.valid){
      Swal({
        allowOutsideClick: false,
        type: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();
  
      this.auth.recoveryPassword(this.recoveryForm.value).subscribe({
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
            title: 'Message Info',
            text: data['messages']
            }).then((result)=>{
              this.router.navigate(['/login']);
            });
            this.resetRecoveryForm(this.recoveryForm);
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

  resetRecoveryForm(form: FormGroup){
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key).setErrors(null) ;
    });
  }

  

}
