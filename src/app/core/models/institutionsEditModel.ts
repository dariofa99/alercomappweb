import { NumberSymbol } from "@angular/common";
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { ContactModel } from "./contactModel";
import { EventTypeModel } from "./eventTypeModel";

export class InstitutionsEditModel {

    constructor(
        public id?: string,
        public institution_name?: string,
        public institution_address?: string,
        public institution_phone?: string,
        public town_id?: number,
        public category_id?: number,
        public contacts?: Array<any>,
        public event_types?: Array<any>,
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class InstitutionsEditAdapter implements Adapter<InstitutionsEditModel> {
    adapt(item: any): InstitutionsEditModel {
      return new InstitutionsEditModel(item['institution'].id,item['institution'].institution_name,item['institution'].institution_address,
        item['institution'].institution_phone,item['institution'].town_id,item['institution'].category_id,item['institution']['contacts'].map(item=>{
          return new ContactModel(item.id,item.institution_contact,item.contact_type_id,item.institution_id)
        })
        ,item['institution']['event_types'].map(item=>{
          return new EventTypeModel(item.id,item.event_type_description,item.event_type_name,item.category_id)
        }));
    }
  }