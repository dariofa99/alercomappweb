import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RoleModel } from "../models/roleModel";
import { AuthService } from "../services/auth.service";
import { RolesPermissionsService } from "../services/roles-permissions.service";

@Injectable({
providedIn:'root'
})

export class RolesResolverService implements Resolve<RoleModel[]>{

    constructor(private rolesPermissionsService: RolesPermissionsService, private auth: AuthService, private route: ActivatedRoute){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): RoleModel[] | Observable<RoleModel[]> | Promise<RoleModel[]> {
        return this.rolesPermissionsService.getRoles(this.auth.readToken());
    }
}