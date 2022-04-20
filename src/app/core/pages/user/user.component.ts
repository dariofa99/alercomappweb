import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/userModel';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {

  @Input() item: UserModel;

  constructor() { }

  ngOnInit(): void {
  }

  updateUser(form: NgForm ){

  }

}
