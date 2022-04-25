
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { RoleModel } from "./roleModel";

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
        }));
    }
  }