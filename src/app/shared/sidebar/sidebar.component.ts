import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})

export class SidebarComponent implements OnInit {
  @Output() alertShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() userShowingUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  status: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  alertShowingEvent(){
    console.log("Click alert")
    this.status = true;
    this.alertShowingUp.emit(true);
  }

  userShowingEvent(){
    console.log("Click user")
    this.status = false;
    this.userShowingUp.emit(true);
  }

}
