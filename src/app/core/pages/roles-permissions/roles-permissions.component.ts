import {AfterViewInit, Component, ViewChild, OnInit, QueryList, ViewChildren, Input, Directive, ViewContainerRef, TemplateRef} from '@angular/core';
import { PermissionsModel } from '../../models/permissionsModel';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from '../../models/roleModel';
import { AuthService } from '../../services/auth.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { DialogNewEditRoleComponent } from '../dialog-new-edit-role/dialog-new-edit-role.component';
import { DialogNewEditPermissionComponent } from '../dialog-new-edit-permission/dialog-new-edit-permission.component';
import Swal from 'sweetalert2';

export class PermissionsChecked{
  constructor(
    public id?: string,
    public guard_name?: number,
    public name?: string,
    public checked?: boolean,
  ){}
}

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styles: [
  ]
})
export class RolesPermissionsComponent implements OnInit, AfterViewInit {
  header = [];
  RowsData = []
  permissionsAux: PermissionsModel[] = [];
  permissionsAuxNew: PermissionsModel[] = [];
  rolesDisplay: RoleModel[] = [];
  @Input() roles: RoleModel[];
  @Input() permissions: PermissionsModel[];
  checked = false;

  constructor(private auth: AuthService, private dialog: MatDialog, private rolesPermissionsService: RolesPermissionsService) {
  }

  ngOnInit(): void {
    this.permissions.forEach(element => {
      this.permissionsAux.push(element);
    });
    for(let i=0;i<this.permissions.length;i++){
      this.permissionsAux.push(new PermissionsChecked('',0,this.permissions[i].name,false))
    }
    this.rolesDisplay.push(new RoleModel(0,'','', this.permissionsAux))
    
    this.header.push('');
    this.roles.forEach(element => {
      this.header.push(element.name);
      element.permissions.sort(function(a,b){return parseInt(a.id) - parseInt(b.id)})
      
      this.permissionsAuxNew = [];

      let i = 0;

      this.permissionsAux.forEach(elementPermissionsAux => {
        element.permissions.forEach(elementPermissions => {
          if(elementPermissionsAux.id == elementPermissions.id){
            this.permissionsAuxNew.push(new PermissionsChecked(elementPermissions.id,elementPermissions.guard_name,elementPermissions.name,true))
          }
        });
        
      });

      let exists = false;
      this.permissions.forEach(element => {
        this.permissionsAuxNew.forEach(elementInside => {
          if(element.id == elementInside.id){
            exists = true;
          }
        });
        if(!exists){
          this.permissionsAuxNew.push(new PermissionsChecked(element.id,element.guard_name,element.name,false))
        }
        exists = false;
      });

      
      this.permissionsAuxNew.sort(function(a,b){return parseInt(a.id) - parseInt(b.id)})
      

      this.rolesDisplay.push(new RoleModel(element.id,element.guard_name,element.name, this.permissionsAuxNew));
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
    
  }

  checkBoxChanged(event: any){
    console.log(event.target.checked)
    console.log(event.target.value.split(','));
    const dataToUpdate = event.target.value.split(',')
    console.log(dataToUpdate[2])
    if(dataToUpdate[2]=="false" && event.target.checked==true){
      this.rolesPermissionsService.sync_rol_permission(this.auth.readToken(),dataToUpdate[0],dataToUpdate[1],'insert').subscribe({
        next: data => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Permiso asociado con éxito'
          });
        },
        error: error => {console.log('There was an error',error)}
      });
    }
    else{
      this.rolesPermissionsService.sync_rol_permission(this.auth.readToken(),dataToUpdate[0],dataToUpdate[1],'delete').subscribe({
        next: data => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Permiso eliminado con éxito'
          });
        },
        error: error => {console.log('There was an error',error)}
      });
    }
  }

  addPermission(){
    this.dialog.open(DialogNewEditPermissionComponent, {
      data:{
      },
      width:'30%'
    })
  }

  addRole(){
    this.dialog.open(DialogNewEditRoleComponent, {
      data:{
      },
      width:'30%'
    })
  }

  editRole(role: any){
    this.dialog.open(DialogNewEditRoleComponent,{
      data:{
        userEdit: role,
      },
      width: '30%'
    })
  }

  deleteRole(id:number){
    this.rolesPermissionsService.deleteRole(this.auth.readToken(),id).subscribe({
      next: data => {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text: 'Rol eliminado con éxito'
        });
      },
      error: error => {console.log('There was an error',error)}
    })
  }

}