
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";
import { CategoryModel } from "./categoryModel";

export class EventTypeModel {

    constructor(
        public id?: number,
        public event_type_description?: string,
        public event_type_name?: string,
        public category_id?: number,
        public category?: CategoryModel
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class EventTypeAdapter implements Adapter<EventTypeModel> {
    adapt(item: any): EventTypeModel {
      return new EventTypeModel(item.id,item.event_type_description, item.event_type_name,
        item.category_id, new CategoryModel(item['category'].id,item['category'].reference_name,
        item['category'].reference_description,item['category'].category,item['category'].section,
        item['category'].is_active));
    }
  }