import { BaseEvent } from "./base-event.model";
import { EventType } from "../enum/event-type.enum";
import { FastifyRequest } from "fastify";
import { FastifyCookieOptions } from "fastify-cookie";
import { RedirectType } from "track/enum/redirect-type.enum";

const DEFAULT_REDIRECT_TYPE = RedirectType.Location;

export class ClickEvent extends BaseEvent {
  
  constructor(public campaign: string) {
    super(EventType.Click);
  }
}