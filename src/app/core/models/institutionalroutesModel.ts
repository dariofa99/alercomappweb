
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class InstitutionalRoutesModel {

    constructor(
        public id?: number,
        public route_name?: string,
        public route_url?: string,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class InstitutionalRoutesAdapter implements Adapter<InstitutionalRoutesModel> {
    adapt(item: any): InstitutionalRoutesModel {
      return new InstitutionalRoutesModel(item.id,item.route_name,item.route_url);
    }
  }