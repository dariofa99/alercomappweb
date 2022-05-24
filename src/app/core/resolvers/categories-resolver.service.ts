import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CategoryModel } from "../models/categoryModel";
import { AuthService } from "../services/auth.service";
import { CategoryService } from "../services/category.service";
import { EventypesService } from "../services/eventypes.service";

@Injectable({
providedIn:'root'
})

export class CategoriesResolverService implements Resolve<CategoryModel[]>{
    constructor(private categoryService: CategoryService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CategoryModel[] | Observable<CategoryModel[]> | Promise<CategoryModel[]> {
        return this.categoryService.getCategories(this.auth.readToken());
    }
}

