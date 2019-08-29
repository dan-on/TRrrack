import { BaseEvent } from "./base-event.model";
import { DefaultHeaders, DefaultQuery, DefaultParams } from "fastify";
import { EventType } from "./event-type.enum";

export class ClickEvent extends BaseEvent {
  constructor(
    headers: DefaultHeaders, 
    query: DefaultQuery,
    params: DefaultParams, 
    cookies: Object,
    public campaign: string
  ) {
    super(EventType.Click, headers, query, params, cookies);
    
  }
}