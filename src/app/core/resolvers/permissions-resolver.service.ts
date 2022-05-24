import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsModel } from "../models/permissionsModel";
import { AuthService } from "../services/auth.service";
import { RolesPermissionsService } from "../services/roles-permissions.service";

@Injectable({
providedIn:'root'
})

export class PermissionsResolverService implements Resolve<PermissionsModel[]>{

    constructor(private rolesPermissionsService: RolesPermissionsService, private auth: AuthService, private route: ActivatedRoute){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PermissionsModel[] | Observable<PermissionsModel[]> | Promise<PermissionsModel[]> {
        return this.rolesPermissionsService.getPermissions(this.auth.readToken());
    }
}