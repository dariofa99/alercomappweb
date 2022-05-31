import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AlertEditViewModel } from "../models/alertEditViewModel";
import { AlertsService } from "../services/alerts.service";
import { AuthService } from "../services/auth.service";

@Injectable({
providedIn:'root'
})

export class AlertByTokenResolverService implements Resolve<AlertEditViewModel>{
    constructor(private alertService: AlertsService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AlertEditViewModel | Observable<AlertEditViewModel> | Promise<AlertEditViewModel> {
        return this.alertService.getAlertByToken(route.paramMap.get("token"));
    }
}