import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';

@Component({
  selector: 'app-dialog-new-edit-role',
  templateUrl: './dialog-new-edit-role.component.html',
  styles: [
  ]
})
export class DialogNewEditRoleComponent implements OnInit {

  roleForm !: FormGroup;
  actionBtn : string = "Guardar";

  constructor(@Inject(MAT_DIALOG_DATA) public editData: any, private dialogRef: MatDialogRef<DialogNewEditRoleComponent>,
  private formBuilder: FormBuilder, private rolesPermissionsService: RolesPermissionsService,
  private auth: AuthService) { 
    this.roleForm = this.formBuilder.group({
      name: ['',Validators.required],
    });
    if(this.editData.roleEdit){
      this.actionBtn = "Actualizar";
      this.roleForm.controls['name'].setValue(this.editData.userEdit.name);
    }
  }

  ngOnInit(): void {
  }

  addRole(){
    console.log(this.roleForm.value);
    if(this.roleForm.valid){
      this.rolesPermissionsService.postRole(this.auth.readToken(),this.roleForm.value).subscribe({
        next: data => {{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Rol creado con éxito'
          });
          this.roleForm.reset();
          this.dialogRef.close('save');
        }},
        error: error => {console.log('There was an error',error)}
      })
    }
  }

  updateRole(){
    console.log(this.roleForm.value);
    console.log(this.editData.userEdit.id);
    if(this.roleForm.valid){
      this.rolesPermissionsService.putRole(this.auth.readToken(),this.editData.userEdit.id,this.roleForm.value).subscribe({
        next: data => {{
          console.log(data);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Rol actualizado con éxito'
          });
          this.roleForm.reset();
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
