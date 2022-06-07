import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/userModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent implements OnInit {
  user: UserModel;

  constructor(private route: ActivatedRoute, public router: Router) {
    this.user = this.route.snapshot.data['user'];
  }

  ngOnInit(): void {}
}
