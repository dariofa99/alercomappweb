import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from '../../models/categoryModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-edit-category',
  templateUrl: './new-edit-category.component.html',
  styles: [
  ]
})
export class NewEditCategoryComponent implements OnInit {

  user: UserModel;
  categoryForm !: FormGroup;
  actionBtn : string = "Guardar";
  idToUpdate: number;
  categoryByID: CategoryModel;
  categories: CategoryModel[] = [];
  selectedCategory;

  constructor(private auth: AuthService,private route: ActivatedRoute, public router: Router,
    private formBuilder: FormBuilder, private categoryService: CategoryService,private toastr: ToastrService) {
    this.user = this.route.snapshot.data['user'];
    this.categoryByID = this.route.snapshot.data['categoryByID'];
    this.categoryForm = this.formBuilder.group({
      reference_name: ['',Validators.required],
      reference_description: ['',Validators.required],
      category: ['',Validators.required],
      table: ['',Validators.required],
    });
   }

  ngOnInit(): void {
    if(this.categoryByID != undefined){
      this.actionBtn = "Actualizar";
      this.categoryForm.controls['reference_name'].setValue(this.categoryByID.reference_name);
      this.categoryForm.controls['reference_description'].setValue(this.categoryByID.reference_description);
      this.categoryForm.controls['category'].setValue(this.categoryByID.category);
      this.categoryForm.controls['table'].setValue('events');
      //this.categoryForm.controls['section'].setValue(null);
    }
  }

  addCategory(){
    this.categoryForm.controls['category'].setValue('event_category');
    this.categoryForm.controls['table'].setValue('events');
    //this.categoryForm.controls['section'].setValue(null);

    console.log(this.categoryForm.value);

    if(this.categoryForm.valid){
      this.categoryService.postCategory(this.auth.readToken(),this.categoryForm.value).subscribe({
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
              text: 'Tipo de categoría creada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-categories']);
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

  updateCategory(){
    if(this.categoryForm.valid){
      this.categoryService.putCategory(this.auth.readToken(),this.categoryByID.id,this.categoryForm.value).subscribe({
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
              text: 'Tipo de categoría actualizada con éxito'
            }).then((result)=>{
              this.router.navigate(['/home/admin-categories']);
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
