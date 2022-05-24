import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { CategoryModel } from "../models/categoryModel";
import { CategoryService } from "../services/category.service";

@Injectable({
providedIn:'root'
})

export class CategoryByIDResolverService implements Resolve<CategoryModel>{
    constructor(private categoryService: CategoryService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CategoryModel | Observable<CategoryModel> | Promise<CategoryModel> {
        return this.categoryService.getCategoryById(this.auth.readToken(),route.paramMap.get("id"));
    }
}