import { Component, Inject, OnInit } from '@angular/core';
import { DepartmentModel } from '../../models/departmentModel';
import { TownModel } from '../../models/townModel';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from '../../models/roleModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-new-edit-user',
  templateUrl: './dialog-new-edit-user.component.html',
  styles: [
  ]
})
export class DialogNewEditUserComponent implements OnInit {

  userForm !: FormGroup;
  towns: TownModel[] = [];
  isOnDepartment = false;
  selectedDepartment: string = "";
  selectedTown: string = "";
  selectedRole: string = "";
  actionBtn : string = "Guardar";

  constructor(@Inject(MAT_DIALOG_DATA) public editData: any, private dialogRef: MatDialogRef<DialogNewEditUserComponent>,
  private formBuilder: FormBuilder, private userService: UserService,
  private auth: AuthService) {
    this.userForm = this.formBuilder.group({
      name: ['',Validators.required],
      lastname: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      password_confirmation: ['',Validators.required],
      town_id: ['',Validators.required],
      role_id: ['',Validators.required]
    });
    if(this.editData.userEdit){
      this.actionBtn = "Actualizar";
      this.userForm.removeControl('password');
      this.userForm.removeControl('password_confirmation');
      this.userForm.controls['name'].setValue(this.editData.userEdit.name);
      this.userForm.controls['lastname'].setValue(this.editData.userEdit.lastname);
      this.userForm.controls['username'].setValue(this.editData.userEdit.username);
      this.userForm.controls['email'].setValue(this.editData.userEdit.email);
      this.userForm.controls['town_id'].setValue(this.editData.userEdit.town_id);
      console.log(this.editData.userEdit.roles.length);
      this.userForm.controls['role_id'].setValue(this.editData.userEdit.roles.length!=0?this.editData.userEdit.roles[0].id:'');
      this.selectedTown = this.editData.userEdit.town_id;
      this.selectedRole = this.editData.userEdit.roles.length!=0?this.editData.userEdit.roles[0].id:'';
      console.log(this.selectedRole);
      this.isOnDepartment = this.editData.isOnDepartment;
    }
   }

  ngOnInit(): void {
    if(this.editData.userEdit){
      this.editData.towns.forEach(element => {
        element.forEach(elementInside => {
          if(elementInside.id == this.editData.userEdit.town_id){
            this.selectedDepartment = elementInside.department_id;
          }
          if(elementInside.department_id == this.selectedDepartment){
            this.towns = element;
          }
        });
      });
    }
  }

  onDepartmentSelected(event: any){
    this.isOnDepartment = true;
    this.editData.towns.forEach(element => {
      element.forEach(elementInside => {
        if(elementInside.department_id == event.value){
          this.towns = element;
        }
      });
    });
  }

  addUser(){
    console.log(this.userForm.value);
    if(this.userForm.valid){
      this.userService.postUser(this.auth.readToken(),this.userForm.value).subscribe({
        next: data => {{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Usuario creado con éxito'
          });
          this.userForm.reset();
          this.dialogRef.close('save');
        }},
        error: error => {console.log('There was an error',error)}
      })
    }
  }

  updateUser(){
    console.log(this.userForm.value);
    console.log(this.editData.userEdit.id);
    if(this.userForm.valid){
      this.userService.putUser(this.auth.readToken(),this.editData.userEdit.id,this.userForm.value).subscribe({
        next: data => {{
          console.log(data);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Usuario actualizado con éxito'
          });
          this.userForm.reset();
          this.dialogRef.close('save');
        }},
        error: error => {console.log('There was an error',error)}
      })
    }
    else{
      console.log('Error');
    }
  }

}
