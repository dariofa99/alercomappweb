import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PreviousRouteService } from './core/services/previous-route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading = false
  title = 'alercom';
  previousUrl;
  currentUrl;

  constructor(public router: Router,private urlService: PreviousRouteService) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.loading = true;
      }
      if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
        this.loading = false;
      }
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event: NavigationEnd) => {
    this.previousUrl = this.currentUrl;
     this.currentUrl = event.url;
     this.urlService.setPreviousUrl(this.previousUrl); 
  });

  }
}
