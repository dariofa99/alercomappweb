import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AlertEditModel } from "../models/alertEditModel";
import { AlertsService } from "../services/alerts.service";
import { AuthService } from "../services/auth.service";

@Injectable({
providedIn:'root'
})

export class AlertByIDResolverService implements Resolve<AlertEditModel>{
    constructor(private alertService: AlertsService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AlertEditModel | Observable<AlertEditModel> | Promise<AlertEditModel> {
        return this.alertService.getAlertById(this.auth.readToken(),route.paramMap.get("id"));
    }
}