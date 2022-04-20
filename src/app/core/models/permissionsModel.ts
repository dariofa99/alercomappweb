import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class PermissionsModel {

    constructor(
        public id?: string,
        public guard_name?: number,
        public name?: string
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class PermissionsAdapter implements Adapter<PermissionsModel> {
    adapt(item: any): PermissionsModel {
      return new PermissionsModel(item.id,item.guard_name,item.name);
    }
  }