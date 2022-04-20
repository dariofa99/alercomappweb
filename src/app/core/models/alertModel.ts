
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { StatusModel } from "./statusModel";
import { TownModel } from "./townModel";

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
        public event_type_id?: number,
        public town_id?: number,
        public status_id?: number,
        public afectations_range_id?: number,
        public town?: TownModel,
        public status?: StatusModel,
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
        item.affected_livelihoods,item.event_type_id,item.town_id,item.status_id,item.afectations_range_id,
        new TownModel(item['town'].id,item['town'].town_name,item['town'].department_id),
        new StatusModel(item['status'].id,item['status'].reference_name,item['status'].category,item['status'].section, item['status'].is_active));
    }
  }