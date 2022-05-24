import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { InstitutionalRoutesModel } from "../models/institutionalroutesModel";
import { AuthService } from "../services/auth.service";
import { InstitutionalRoutesService } from "../services/institutional-routes.service";

@Injectable({
providedIn:'root'
})

export class InstitutionalRouteByIDResolverService implements Resolve<InstitutionalRoutesModel>{
    constructor(private institutionalRoutesService: InstitutionalRoutesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InstitutionalRoutesModel | Observable<InstitutionalRoutesModel> | Promise<InstitutionalRoutesModel> {
        return this.institutionalRoutesService.getInstitutionalRouteById(this.auth.readToken(),route.paramMap.get("id"));
    }
}