
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { DepartmentModel } from "./departmentModel";

export class TownModel {

    constructor(
        public id?: number,
        public town_name?: string,
        public department_id?: number,
        public department?: DepartmentModel
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class TownAdapter implements Adapter<TownModel> {
    adapt(item: any): TownModel {
      return new TownModel(item.id,item.town_name, item.department_id, 
        new DepartmentModel(item['department'].id,item['department'].reference_name,item['department'].category.id,item['department'].section,
      item['department'].is_active));
    }
  }