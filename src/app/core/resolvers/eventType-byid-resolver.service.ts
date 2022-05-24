import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { EventTypeModel } from "../models/eventTypeModel";
import { EventypesService } from "../services/eventypes.service";

@Injectable({
providedIn:'root'
})

export class EventTypeByIDResolverService implements Resolve<EventTypeModel>{
    constructor(private eventTypesService: EventypesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): EventTypeModel | Observable<EventTypeModel> | Promise<EventTypeModel> {
        return this.eventTypesService.getEventTypeById(this.auth.readToken(),route.paramMap.get("id"));
    }
}