
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { AffectRangeModel } from "./affectRangeModel";
import { EventTypeModel } from "./eventTypeModel";
import { StatusModel } from "./statusModel";
import { TownModel } from "./townModel";
import { UserModel } from "./userModel";

export class AlertModel {

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
        public affected_enviroment?: number,
        public user_id?: number,
        public event_type_id?: number,
        public town_id?: number,
        public status_id?: number,
        public afectations_range_id?: number,
        public town?: TownModel,
        public status?: StatusModel,
        public event_type?: EventTypeModel,
        public user?: UserModel,
        public affectation_range?: AffectRangeModel
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class AlertAdapter implements Adapter<AlertModel> {
    adapt(item: any): AlertModel {
      return new AlertModel(item.id,item.event_description, item.event_date,
        item.event_place,item.longitude,item.latitude,item.event_aditional_information,
        item.affected_people,item.affected_family,item.affected_infrastructure,
        item.affected_livelihoods,item.affected_animals,item.affected_enviroment,item.user_id,item.event_type_id,item.town_id,item.status_id,item.afectations_range_id,
        
        new TownModel(item['town'].id,item['town'].town_name,item['town'].department_id),
        
        new StatusModel(item['status'].id,item['status'].reference_name,item['status'].category,item['status'].section, item['status'].is_active),
        
        new EventTypeModel(item['event_type'].id,item['event_type'].event_type_description,item['event_type'].event_type_name,item['event_type'].category_id),
        
        new UserModel(item['user'].id,item['user'].username, item['user'].name,
          item['user'].lastname, item['user'].email, item['user'].email_verified_at, item['user'].phone_number,item['user'].address,
          item['user'].status_id,item['user'].town_id,item['user'].created_at,item['user'].updated_at),
        new AffectRangeModel(item['affectation_range'],item['affectation_range'].reference_name,item['affectation_range'].category,item['affectation_range'].section,item['affectation_range'].is_active));
    }
  }