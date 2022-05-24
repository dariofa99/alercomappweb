import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoryModel } from '../../models/categoryModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { EventypesService } from '../../services/eventypes.service';

@Component({
  selector: 'app-new-edit-typealert',
  templateUrl: './new-edit-typealert.component.html',
  styles: [
  ]
})
export class NewEditTypealertComponent implements OnInit {

  user: UserModel;
  eventTypeForm !: FormGroup;
  actionBtn : string = "Guardar";
  idToUpdate: number;
  eventTypeByID: EventTypeModel;
  categories: CategoryModel[] = [];
  selectedCategory;

  constructor(private auth: AuthService,private route: ActivatedRoute, public router: Router,
    private formBuilder: FormBuilder, private eventTypesService: EventypesService,private toastr: ToastrService) {
    this.user = this.route.snapshot.data['user'];
    this.eventTypeByID = this.route.snapshot.data['eventTypeByID'];
    this.categories = this.route.snapshot.data['categories'];
    this.eventTypeForm = this.formBuilder.group({
      event_type_description: ['',Validators.required],
      event_type_name: ['',Validators.required],
      category_id: ['',Validators.required],
    });
   }

  ngOnInit(): void {
    if(this.eventTypeByID != undefined){
      this.actionBtn = "Actualizar";
      this.eventTypeForm.controls['event_type_description'].setValue(this.eventTypeByID.event_type_description);
      this.eventTypeForm.controls['event_type_name'].setValue(this.eventTypeByID.event_type_name);
      this.eventTypeForm.controls['category_id'].setValue(this.eventTypeByID.category_id);
      this.selectedCategory = this.eventTypeByID.category_id;
    }
  }

  addEventType(){
    if(this.eventTypeForm.valid){
      this.eventTypesService.postEventType(this.auth.readToken(),this.eventTypeForm.value).subscribe({
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
              text: 'Tipo de alerta creado con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-event-types']);
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

  updateEventType(){
    if(this.eventTypeForm.valid){
      this.eventTypesService.putEventType(this.auth.readToken(),this.eventTypeByID.id,this.eventTypeForm.value).subscribe({
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
              text: 'Tipo de alerta actualizado con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-event-types']);
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

  onCategorySelected(event: any){

  }

}
