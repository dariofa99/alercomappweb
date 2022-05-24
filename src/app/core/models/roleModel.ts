import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { PermissionsAdapter, PermissionsModel } from "./permissionsModel";

export class RoleModel {

    constructor(
        public id?: number,
        public guard_name?: string,
        public name?: string,
        public permissions?: PermissionsModel[]
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class RoleAdapter implements Adapter<RoleModel> {
    permissionAdapter: PermissionsAdapter = new PermissionsAdapter();
    adapt(item: any): RoleModel {
      return new RoleModel(item.id,item.guard_name,item.name,
        item['permissions'] != undefined? item['permissions'].map((item)=>{
          return this.permissionAdapter.adapt(item);
        }):null);
    }
  }