import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PermissionsAdapter, PermissionsModel } from '../../models/permissionsModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';

@Component({
  selector: 'app-new-edit-permission',
  templateUrl: './new-edit-permission.component.html',
  styles: [
  ]
})
export class NewEditPermissionComponent implements OnInit {

  user: UserModel;
  permissions: PermissionsModel[];
  permissionForm !: FormGroup;
  actionBtn : string = "Guardar";
  idToUpdate: number;

  constructor(private auth: AuthService, private rolesPermissionsService: RolesPermissionsService,private route: ActivatedRoute, public router: Router,
    private formBuilder: FormBuilder,private adapterPermission: PermissionsAdapter,private toastr: ToastrService) { 
      this.permissions = this.route.snapshot.data['permissions'];
    this.user = this.route.snapshot.data['user'];
    this.permissionForm = this.formBuilder.group({
      name: ['',Validators.required],
    });
    }

  ngOnInit(): void {
  }

  addPermission(){
    if(this.permissionForm.valid){
      this.rolesPermissionsService.postPermission(this.auth.readToken(),this.permissionForm.value).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            this.permissions = data['permissions'].map((item) => {
              return this.adapterPermission.adapt(item)
            }) 
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Rol creado con éxito'
            });
            this.permissionForm.reset();
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }

  updatePermission(){
    if(this.permissionForm.valid){
      this.rolesPermissionsService.putPermission(this.auth.readToken(),this.idToUpdate,this.permissionForm.value).subscribe({
        next: data => {{
          if(data['errors']!=undefined?data['errors'].length!=0:false){
            data['errors'].map(res => {
              this.toastr.error(res);
            })
          }
          else{
            this.permissions = data['permissions'].map((item) => {
              return this.adapterPermission.adapt(item)
            }) 
            Swal({
              allowOutsideClick: false,
              type: 'success',
              text: 'Permiso actualizado con éxito'
            });
            this.permissionForm.reset();
            this.idToUpdate = -1;
          }
        }},
        error: error => {
          Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
          console.log('There was an error',error)
        }
      })
    }
  }

  editPermission(permission: any){
    this.actionBtn = "Actualizar";
    this.permissionForm.controls['name'].setValue(permission.name);
    this.idToUpdate = permission.id;
  }

  deletePermission(id:number){
    Swal({  
      title: 'Realmente deseas eliminar este rol?',  
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {    
          this.rolesPermissionsService.deleteRole(this.auth.readToken(),id).subscribe({
            next: data => {
              if(data['errors']!=undefined?data['errors'].length!=0:false){
                data['errors'].map(res => {
                  this.toastr.error(res);
                })
              }
              else{
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Permiso eliminado con éxito'
                });
                this.permissions = this.permissions.filter(item=>item.id!=id.toString())
                this.actionBtn = "Guardar";
              }
            },
            error: error => {
              Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
              console.log('There was an error',error)
            }
          });
        } else if (result) {    
       }
    });

    
  }

}
