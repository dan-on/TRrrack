import { EventType } from "../enum/event-type.enum";
import { DefaultHeaders, DefaultQuery, DefaultParams } from "fastify";

export interface IEvent {
  id: string;
  ip: string;
  type: EventType;
  time: number;
  headers: DefaultHeaders;
  query: DefaultQuery;
  params: DefaultParams;
  cookies: Object;
}