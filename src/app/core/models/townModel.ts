
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class TownModel {

    constructor(
        public id?: number,
        public town_name?: string,
        public deparment_id?: number,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class TownAdapter implements Adapter<TownModel> {
    adapt(item: any): TownModel {
      return new TownModel(item.id,item.town_name, item.deparment_id);
    }
  }