import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ReferencesService } from "../services/references.service";
import { StatusModel } from "../models/statusModel";

@Injectable({
providedIn:'root'
})

export class StatusResolverService implements Resolve<StatusModel[]>{
    constructor(private referencesService: ReferencesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): StatusModel[] | Observable<StatusModel[]> | Promise<StatusModel[]> {
        return this.referencesService.getStatus(this.auth.readToken());
    }
}