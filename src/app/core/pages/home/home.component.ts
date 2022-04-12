import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  isOnUser = false;
  isOnAlert = false;

  constructor() { }

  ngOnInit(): void {
  }

  onalertShowingUp(value){
    console.log("Receipt value on alert")
    this.isOnAlert = value;
    this.isOnUser = false;
  }

  onuserShowingUp(value){
    console.log("Receipt value on user")
    this.isOnUser = value;
    this.isOnAlert = false;
  }

}
