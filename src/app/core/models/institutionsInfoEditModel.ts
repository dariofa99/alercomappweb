import { NumberSymbol } from "@angular/common";
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { ContactModel } from "./contactModel";
import { DepartmentModel } from "./departmentModel";
import { EventTypeModel } from "./eventTypeModel";
import { TownModel } from "./townModel";

export class InstitutionsInfoEditModel {

    constructor(
        public id?: string,
        public institution_name?: string,
        public institution_address?: string,
        public institution_phone?: string,
        public category_id?: number,
        public town_id?: number,
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class InstitutionsInfoEditAdapter implements Adapter<InstitutionsInfoEditModel> {
    adapt(item: any): InstitutionsInfoEditModel {
      return new InstitutionsInfoEditModel(item['institutions'].id,item['institutions'].institution_name,item['institutions'].institution_address,
        item['institutions'].institution_phone,item['institutions'].town_id,item['institutions'].category_id);
    }
  }