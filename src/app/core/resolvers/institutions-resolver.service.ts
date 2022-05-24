import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { InstitutionsModel } from "../models/institutionsModel";
import { AuthService } from "../services/auth.service";
import { InstitutionsService } from "../services/institutions.service";

@Injectable({
providedIn:'root'
})

export class InstitutionsResolverService implements Resolve<InstitutionsModel[]>{
    constructor(private institutionsService: InstitutionsService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InstitutionsModel[] | Observable<InstitutionsModel[]> | Promise<InstitutionsModel[]> {
        return this.institutionsService.getInstitutions(this.auth.readToken());
    }
}

