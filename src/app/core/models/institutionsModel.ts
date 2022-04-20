import { NumberSymbol } from "@angular/common";
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class InstitutionsModel {

    constructor(
        public id?: string,
        public institution_name?: string,
        public institution_address?: string,
        public institution_phone?: string,
        public town_id?: number,
        public contacts?: Array<any>,
        public contact_type_id?: Array<any>,
        public event_types?: Array<any>,
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class InstitutionsAdapter implements Adapter<InstitutionsModel> {
    adapt(item: any): InstitutionsModel {
      return new InstitutionsModel(item.id,item.institution_name,item.institution_address,
        item.institution_phone,item.town_id,item['contacts'],item['contact_type_id'],item['event_types']);
    }
  }