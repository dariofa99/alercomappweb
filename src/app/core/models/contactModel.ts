
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class ContactModel {

    constructor(
        public id?: number,
        public institution_contact?: string,
        public contact_type_id?: string,
        public institution_id?: number,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class ContactAdapter implements Adapter<ContactModel> {
    adapt(item: any): ContactModel {
      return new ContactModel(item.id,item.institution_contact, item.contact_type_id,
        item.institution_id);
    }
  }