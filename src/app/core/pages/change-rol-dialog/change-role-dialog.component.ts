import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from '../../models/roleModel';

export interface RoleData {
  selectedRole: number;
  roles: RoleModel[];
}

@Component({
  selector: 'app-change-role-dialog',
  templateUrl: './change-role-dialog.component.html',
  styles: [
  ]
})
export class ChangeRoleDialogComponent implements OnInit {

  roleSelected: number;

  constructor(public dialogRef: MatDialogRef<ChangeRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onRoleSelected(user: any){
    this.roleSelected = user.value;
  }

}
