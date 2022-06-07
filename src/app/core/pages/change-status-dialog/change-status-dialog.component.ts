import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusModel } from '../../models/statusModel';

export interface StatusData {
  selectedStatus: number;
  status: StatusModel[];
}

@Component({
  selector: 'app-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styles: [
  ]
})
export class ChangeStatusDialogComponent implements OnInit {

  statusSelected: number;

  constructor(public dialogRef: MatDialogRef<ChangeStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onStatusSelected(event: any){
    this.statusSelected = event.value;
  }

}
