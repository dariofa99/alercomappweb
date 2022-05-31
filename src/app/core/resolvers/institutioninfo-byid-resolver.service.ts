import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { InstitutionsEditModel } from "../models/institutionsEditModel";
import { InstitutionsInfoModel } from "../models/institutionsInfoModel";
import { AuthService } from "../services/auth.service";
import { InstitutionsService } from "../services/institutions.service";

@Injectable({
providedIn:'root'
})

export class InstitutionInfoByIDResolverService implements Resolve<InstitutionsInfoModel>{
    constructor(private institutionsService: InstitutionsService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InstitutionsInfoModel | Observable<InstitutionsInfoModel> | Promise<InstitutionsInfoModel> {
        return this.institutionsService.getInstitutionById(this.auth.readToken(),route.paramMap.get("id"));
    }
}

