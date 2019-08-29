import { IEvent } from "track/interfaces/event.interface";
import { EventType } from "track/enum/event-type.enum";

import { IncomingMessage } from "http";
import { FastifyRequest, DefaultQuery, DefaultParams, DefaultHeaders } from "fastify";
import { FastifyCookieOptions } from 'fastify-cookie';

export class EventModel implements IEvent {
  type: EventType;
  headers: DefaultHeaders;
  params: DefaultParams;
  query: DefaultQuery;
  cookies: object;
  time: number;

  constructor(type: EventType, request: FastifyRequest<IncomingMessage, FastifyCookieOptions>) {
    this.type = type;
    this.headers = request.headers;
    this.params = request.params;
    this.query = request.query;
    this.cookies = request.cookies;
    this.time = Math.floor(Date.now() / 1000);
  }
}