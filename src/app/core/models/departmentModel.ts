
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class DepartmentModel {

    constructor(
        public id?: number,
        public reference_name?: string,
        public category?: string,
        public section?: string,
        public is_active?: number,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class DepartmentAdapter implements Adapter<DepartmentModel> {
    adapt(item: any): DepartmentModel {
      return new DepartmentModel(item.id,item.reference_name, item.category,
        item.section,item.is_active);
    }
  }