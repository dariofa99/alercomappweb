import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AffectRangeModel } from "../models/affectRangeModel";
import { AuthService } from "../services/auth.service";
import { ReferencesService } from "../services/references.service";

@Injectable({
providedIn:'root'
})

export class AffectsRangeResolverService implements Resolve<AffectRangeModel[]>{
    constructor(private referencessService: ReferencesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AffectRangeModel[] | Observable<AffectRangeModel[]> | Promise<AffectRangeModel[]> {
        return this.referencessService.getAffectsRanges(this.auth.readToken());
    }
}

