
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class AffectRangeModel {

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
  export class AffectRangeAdapter implements Adapter<AffectRangeModel> {
    adapt(item: any): AffectRangeModel {
      return new AffectRangeModel(item.id,item.reference_name, item.category,
        item.section,item.is_active);
    }
  }