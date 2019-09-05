import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { ImpressionEvent, ClickEvent, TransitionEvent } from "./models";
import { RedirectType } from "./enum/redirect-type.enum";
import { readFileSync } from 'fs';

const GIF_PIXEL_BUFF = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 
  0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 
  0x02, 0x44, 0x01, 0x00, 0x3b]);

const PROXYPAGE_TPL = readFileSync('./src/track/static/proxypage.html')

export async function impressionHandler (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const campaign = request.params.campaign;
  const event = (new ImpressionEvent(campaign)).fromRequest(request)
  await this.trackService.exploreEvent(event);
  
  // Write impression event
  this.trackService.pushEvent(event);
  reply.type('image/gif').send(GIF_PIXEL_BUFF);
};

export async function clickHandler(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const campaign = request.params.campaign;
  
  const event = (new ClickEvent(campaign)).fromRequest(request)
  await this.trackService.exploreEvent(event);
  const targetUrl = 'https://google.com/';
  let redirectType = 1

  switch(redirectType) {
    case RedirectType.Location: 
      reply.redirect(targetUrl);
      break;
    case RedirectType.ProxyPage:
      reply
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(PROXYPAGE_TPL)
      break;
    default:
      throw new Error('Unknown redirect type');
  }

  // Write click event
  this.trackService.pushEvent(event);
};

export async function transitionHandler (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {

  const url = request.params.url;
  const event = (new TransitionEvent(url)).fromRequest(request);
  await this.trackService.exploreEvent(event);

  const targetUrl = this.trackService.buildTargetUrl(request.query.target);
  reply.redirect(targetUrl);

  // Write transition event
  this.trackService.pushEvent(event);
};

export async function conversionHandler (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  //const event = new EventModel(EventType.Conversion, request);  
  reply.type('image/gif').send(GIF_PIXEL_BUFF);

  // Write conversion event
  this.trackService.pushEvent(event);
};
