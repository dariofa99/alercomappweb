
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class CategoryModel {

    constructor(
        public id?: number,
        public reference_name?: string,
        public reference_description?: string,
        public category?: string,
        public section?: string,
        public is_active?: number,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class CategoryAdapter implements Adapter<CategoryModel> {
    adapt(item: any): CategoryModel {
      return new CategoryModel(item.id,item.reference_name, item.reference_description, item.category,
        item.section,item.is_active);
    }
  }