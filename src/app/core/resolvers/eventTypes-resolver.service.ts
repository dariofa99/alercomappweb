import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { EventTypeModel } from "../models/eventTypeModel";
import { AuthService } from "../services/auth.service";
import { EventypesService } from "../services/eventypes.service";

@Injectable({
providedIn:'root'
})

export class EventTypesResolverService implements Resolve<EventTypeModel[]>{
    constructor(private eventTypesService: EventypesService, private auth: AuthService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): EventTypeModel[] | Observable<EventTypeModel[]> | Promise<EventTypeModel[]> {
        return this.eventTypesService.getEventTypes(this.auth.readToken());
    }
}

