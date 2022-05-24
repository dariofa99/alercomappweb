
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { DepartmentModel } from "./departmentModel";
import { RoleModel } from "./roleModel";
import { StatusModel } from "./statusModel";
import { TownModel } from "./townModel";

export class UserModel {

    constructor(
        public id?: number,
        public username?: string,
        public name?: string,
        public lastname?: string,
        public email?: string,
        public email_verified_at?: null,
        public phone_number?: string,
        public address?: string,
        public status_id?: number,
        public town_id?: number,
        public created_at?: string,
        public updated_at?: string,
        public roles?: RoleModel[],
        public town?: TownModel,
        public status?: StatusModel,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class UserAdapter implements Adapter<UserModel> {
    adapt(item: any): UserModel {
      return new UserModel(item.id,item.username, item.name,
        item.lastname, item.email, item.email_verified_at, item.phone_number,item.address,
        item.status_id,item.town_id,item.created_at,item.updated_at,
        item['roles'].map(item=>{
          return new RoleModel(item.id,item.guard_name,item.name)
        }),
        new TownModel(item['town'].id,item['town'].town_name,item['town'].department_id,
        new DepartmentModel(item['town']['department'].id,item['town']['department'].reference_name,
        item['town']['department'].category,item['town']['department'].section,item['town']['department'].is_active)),
        new StatusModel(item['status'].id,item['status'].reference_name,item['status'].category,item['status'].section,
        item['status'].is_active));
    }
  }