import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';

@Component({
  selector: 'app-dialog-new-edit-permission',
  templateUrl: './dialog-new-edit-permission.component.html',
  styles: [
  ]
})
export class DialogNewEditPermissionComponent implements OnInit {

  permissionForm !: FormGroup;
  actionBtn : string = "Guardar";

  constructor(@Inject(MAT_DIALOG_DATA) public editData: any, private dialogRef: MatDialogRef<DialogNewEditPermissionComponent>,
  private formBuilder: FormBuilder, private rolesPermissionsService: RolesPermissionsService,
  private auth: AuthService) { 
    this.permissionForm = this.formBuilder.group({
      name: ['',Validators.required],
    });
    if(this.editData.roleEdit){
      this.actionBtn = "Actualizar";
      this.permissionForm.controls['name'].setValue(this.editData.permissionEdit.name);
    }
  }

  ngOnInit(): void {
  }

  addPermission(){
    console.log(this.permissionForm.value);
    if(this.permissionForm.valid){
      this.rolesPermissionsService.postPermission(this.auth.readToken(),this.permissionForm.value).subscribe({
        next: data => {{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Permiso creado con éxito'
          });
          this.permissionForm.reset();
          this.dialogRef.close('save');
        }},
        error: error => {console.log('There was an error',error)}
      })
    }
  }

  updatePermission(){
    console.log(this.permissionForm.value);
    console.log(this.editData.userEdit.id);
    if(this.permissionForm.valid){
      this.rolesPermissionsService.putPermission(this.auth.readToken(),this.editData.userEdit.id,this.permissionForm.value).subscribe({
        next: data => {{
          console.log(data);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Permiso actualizado con éxito'
          });
          this.permissionForm.reset();
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
