import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class RoleModel {

    constructor(
        public id?: number,
        public guard_name?: string,
        public name?: string
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class RoleAdapter implements Adapter<RoleModel> {
    adapt(item: any): RoleModel {
      return new RoleModel(item.id,item.guard_name,item.name);
    }
  }