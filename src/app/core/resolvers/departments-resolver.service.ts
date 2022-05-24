import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { DepartmentModel } from "../models/departmentModel";
import { ReferencesService } from "../services/references.service";

@Injectable({
providedIn:'root'
})

export class DepartmentsResolverService implements Resolve<DepartmentModel[]>{
    constructor(private referencesService: ReferencesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DepartmentModel[] | Observable<DepartmentModel[]> | Promise<DepartmentModel[]> {
        return this.referencesService.getDepartments(this.auth.readToken());
    }
}