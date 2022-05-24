import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InstitutionalRoutesModel } from '../../models/institutionalroutesModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { InstitutionalRoutesService } from '../../services/institutional-routes.service';

@Component({
  selector: 'app-new-edit-institutional-route',
  templateUrl: './new-edit-institutional-route.component.html',
  styles: [
  ]
})
export class NewEditInstitutionalRouteComponent implements OnInit {

  user: UserModel;
  institutionalRouteForm !: FormGroup;
  actionBtn : string = "Guardar";
  idToUpdate: number;
  institutionalRouteByID: InstitutionalRoutesModel;

  constructor(private auth: AuthService,private route: ActivatedRoute, public router: Router,
    private formBuilder: FormBuilder, private institutionalRoutesService: InstitutionalRoutesService,private toastr: ToastrService) {
    this.user = this.route.snapshot.data['user'];
    this.institutionalRouteByID = this.route.snapshot.data['institutionalRouteByID'];
    this.institutionalRouteForm = this.formBuilder.group({
      route_name: ['',Validators.required],
      route_url: ['',Validators.required],
    });
   }

  ngOnInit(): void {
    if(this.institutionalRouteByID != undefined){
      this.actionBtn = "Actualizar";
      this.institutionalRouteForm.controls['route_name'].setValue(this.institutionalRouteByID.route_name);
      this.institutionalRouteForm.controls['route_url'].setValue(this.institutionalRouteByID.route_url);
    }
  }

  addInstitutionalRoute(){
    if(this.institutionalRouteForm.valid){
      this.institutionalRoutesService.postInstitutionalRoute(this.auth.readToken(),this.institutionalRouteForm.value).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Ruta institucional creada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-institutional-routes']);
            });
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }

  updateInstitutionalRoute(){
    if(this.institutionalRouteForm.valid){
      this.institutionalRoutesService.putInstitutionalRoute(this.auth.readToken(),this.institutionalRouteByID.id,this.institutionalRouteForm.value).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Ruta institucional actualizada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-institutional-routes']);
            });
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }

}
