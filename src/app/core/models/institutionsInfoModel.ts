import { NumberSymbol } from "@angular/common";
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { ContactModel } from "./contactModel";
import { DepartmentModel } from "./departmentModel";
import { EventTypeModel } from "./eventTypeModel";
import { TownModel } from "./townModel";

export class InstitutionsInfoModel {

    constructor(
        public id?: string,
        public institution_name?: string,
        public institution_address?: string,
        public institution_phone?: string,
        public town_id?: number,
        public category_id?: number,
        public town?: TownModel,
    )
    {}

}

@Injectable({
    providedIn: "root",
  })
  export class InstitutionsInfoAdapter implements Adapter<InstitutionsInfoModel> {
    adapt(item: any): InstitutionsInfoModel {
      return new InstitutionsInfoModel(item.id,item.institution_name,item.institution_address,
        item.institution_phone,item.town_id,item.category_id,new TownModel(item['town'].id,item['town'].town_name,
        item['town'].department_id,new DepartmentModel(item['town']['department'].id,item['town']['department'].reference_name,
        item['town']['department'].category,item['town']['department'].section,item['town']['department'].is_active)));
    }
  }