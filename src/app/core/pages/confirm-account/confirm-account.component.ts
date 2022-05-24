import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styles: [
  ]
})
export class ConfirmAccountComponent implements OnInit {

  confirmAccount = "";
  isConfirmAccount = false;
  confirmAccountForm: FormGroup;

  constructor(private route: ActivatedRoute, private auth: AuthService,private toastr: ToastrService,
    private formBuilder: FormBuilder) {
      this.confirmAccountForm = this.formBuilder.group({
        remember_token: ['',Validators.required,],
     });
     this.confirmAccountForm.controls['remember_token'].setValue(this.route.snapshot.params['token']);
    }

  ngOnInit(): void {
    this.auth.confirmAccount(this.confirmAccountForm.value).subscribe({
      next: data => {
        if(data['errors']!=undefined?data['errors'].length!=0:false){
          data['errors'].map(res => {
            this.toastr.error(res);
            this.confirmAccount = "Su cuenta no pudo ser confirmada";
          })
        }
        else{
          this.confirmAccount = "Su cuenta se confirmo exitosamente";
          this.isConfirmAccount = true;
        }
      },
      error: error => {
        Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'});
        this.confirmAccount = "Su cuenta no pudo ser confirmada";
        console.log('There was an error',error)
      }
    });
  }

}
