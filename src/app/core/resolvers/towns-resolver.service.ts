import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { TownModel } from "../models/townModel";
import { ReferencesService } from "../services/references.service";

@Injectable({
providedIn:'root'
})

export class TownsResolverService implements Resolve<TownModel[]>{
    constructor(private referencesService: ReferencesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TownModel[] | Observable<TownModel[]> | Promise<TownModel[]> {
        return this.referencesService.getTownsList(this.auth.readToken());
    }
}