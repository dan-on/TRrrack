import { BaseEvent } from "./base-event.model";
import { DefaultHeaders, DefaultQuery, DefaultParams } from "fastify";
import { EventType } from "./event-type.enum";

export class ImpressionEvent extends BaseEvent {
  constructor(
    headers: DefaultHeaders, 
    query: DefaultQuery,
    params: DefaultParams, 
    cookies: Object,
    public campaign: string
  ) {
    super(EventType.Impression, headers, query, params, cookies);
    
  }
}