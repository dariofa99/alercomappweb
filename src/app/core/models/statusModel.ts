
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class StatusModel {

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
  export class StatusAdapter implements Adapter<StatusModel> {
    adapt(item: any): StatusModel {
      return new StatusModel(item.id,item.reference_name, item.category,
        item.section,item.is_active);
    }
  }