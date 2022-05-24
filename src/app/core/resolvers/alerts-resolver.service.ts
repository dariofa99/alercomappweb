import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AlertModel } from "../models/alertModel";
import { AlertsService } from "../services/alerts.service";
import { AuthService } from "../services/auth.service";

@Injectable({
providedIn:'root'
})

export class AlertsResolverService implements Resolve<AlertModel[]>{
    constructor(private alertService: AlertsService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AlertModel[] | Observable<AlertModel[]> | Promise<AlertModel[]> {
        return this.alertService.getAlerts(this.auth.readToken());
    }
}

