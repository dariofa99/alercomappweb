
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { AffectRangeModel } from "./affectRangeModel";
import { CategoryModel } from "./categoryModel";
import { DepartmentModel } from "./departmentModel";
import { EventTypeModel } from "./eventTypeModel";
import { FileModel } from "./fileModel";
import { StatusModel } from "./statusModel";
import { TownModel } from "./townModel";
import { UserModel } from "./userModel";

export class AlertEditViewModel {

    constructor(
        public id?: number,
        public event_description?: string,
        public event_date?: string,
        public event_place?: string,
        public longitude?: number,
        public latitude?: number,
        public event_aditional_information?: string,
        public affected_people?: number,
        public affected_family?: number,
        public affected_infrastructure?: number,
        public affected_livelihoods?: number,
        public affected_animals?: number,
        public affected_environment?: number,
        public event_type?: EventTypeModel,
        public event_type_id?: number,
        public town_id?: number,
        public status_id?: number,
        public afectations_range_id?: number,
        public town?: TownModel,
        public status?: StatusModel,
        public user_id?: number,
        public user?: UserModel,
        public affectation_range?: AffectRangeModel,
        public files?: FileModel[],
        public department?: DepartmentModel,
        public token?: string
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class AlertEditViewAdapter implements Adapter<AlertEditViewModel> {
    adapt(item: any): AlertEditViewModel {
      return new AlertEditViewModel(item['event'].id,item['event'].event_description, item['event'].event_date,
        item['event'].event_place,item['event'].longitude,item['event'].latitude,item['event'].event_aditional_information,
        item['event'].affected_people,item['event'].affected_family,item['event'].affected_infrastructure,
        item['event'].affected_livelihoods,item['event'].affected_animals,item['event'].affected_enviroment,new EventTypeModel(item['event']['event_type'].id,item['event']['event_type'].event_type_description,item['event']['event_type'].event_type_name,item['event']['event_type'].category_id,new CategoryModel(item['event']['event_type']['category'].id,
        item['event']['event_type']['category'].reference_name,item['event']['event_type']['category'].reference_description,item['event']['event_type']['category'].category,item['event']['event_type']['category'].section,item['event']['event_type']['category'].is_active)),item['event'].event_type_id,item['event'].town_id,item['event'].status_id,item['event'].afectations_range_id,
        new TownModel(item['event']['town'].id,item['event']['town'].town_name,item['event']['town'].department_id),
        new StatusModel(item['event']['status'].id,item['event']['status'].reference_name,item['event']['status'].category,item['event']['status'].section, item['event']['status'].is_active),item['event'].user_id,new UserModel(item['event']['user'].id,item['event']['user'].username, item['event']['user'].name,
          item['event']['user'].lastname, item['event']['user'].email, item['event']['user'].email_verified_at, item['event']['user'].phone_number,item['event']['user'].address,
          item['event']['user'].status_id,item['event']['user'].town_id,item['event']['user'].created_at,item['event']['user'].updated_at),
          new AffectRangeModel(item['event']['affectation_range'].id,item['event']['affectation_range'].reference_name,item['event']['affectation_range'].category,
          item['event']['affectation_range'].section,item['event']['affectation_range'].is_active), item['event']['files'].map(item=>{
            return new FileModel(item.id,item.original_name, item.encrypt_name,
              item.path,item.size,item.real_path)
          }),new DepartmentModel(item['event']['town']['department'].id,item['event']['town']['department'].reference_name,
          item['event']['town']['department'].category,item['event']['town']['department'].section,item['event']['town']['department'].is_active),item['event']['pivot'].verification_token);
    }
  }