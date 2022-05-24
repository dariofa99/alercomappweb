import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { UserModel } from "../models/userModel";
import { AuthService } from "../services/auth.service";

@Injectable({
providedIn:'root'
})

export class UserByIDResolverService implements Resolve<UserModel>{
    constructor(private userService: UserService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserModel | Observable<UserModel> | Promise<UserModel> {
        return this.userService.getUserById(this.auth.readToken(),route.paramMap.get("id"));
    }
}