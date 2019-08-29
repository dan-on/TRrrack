import { EventType } from "./event-type.enum";
import { DefaultHeaders, DefaultQuery, DefaultParams } from "fastify";

export interface IEvent {
  id: string;
  type: EventType;
  time: number;
  headers: DefaultHeaders;
  query: DefaultQuery;
  params: DefaultParams;
  cookies: Object;
}