import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { InstitutionalRoutesModel } from "../models/institutionalroutesModel";
import { InstitutionalRoutesService } from "../services/institutional-routes.service";
import { AuthService } from "../services/auth.service";

@Injectable({
providedIn:'root'
})

export class InstitutionalRoutesResolverService implements Resolve<InstitutionalRoutesModel[]>{
    constructor(private institutionalRoutesService: InstitutionalRoutesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InstitutionalRoutesModel[] | Observable<InstitutionalRoutesModel[]> | Promise<InstitutionalRoutesModel[]> {
        return this.institutionalRoutesService.getInstitutionalRoutes(this.auth.readToken());
    }
}

