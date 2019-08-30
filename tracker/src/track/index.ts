import { clickSchema, transitionSchema, conversionSchema, impressionSchema } from './schemas';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { RedirectType } from './events/redirect-type.enum';
import { readFileSync } from 'fs';
import { ImpressionEvent } from './events/impression-event.model';
import { ClickEvent } from './events/click-event.model';
import { UserIdExplorer } from './explorers/user-id.explorer';
import { TransitionEvent } from './events/transition-event.model';

export async function registerHandlers (fastify, opts) {
  // Update our property
  //fastify.addHook('preHandler', preHandler);
  fastify.get('/click/:campaign', clickSchema, clickHandler);
  fastify.get('/impression/:campaign', impressionSchema, impressionHandler);
  fastify.post('/transition/:campaign', transitionSchema, transitionHandler);
  fastify.get('/conversion/:clickId', conversionSchema, conversionHandler);
}

const PROXYPAGE_TPL = readFileSync('./src/track/static/proxypage.html')

// Beautiful GIF pixel...
const GIF_PIXEL_BUFF = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 
  0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 
  0x02, 0x44, 0x01, 0x00, 0x3b]);

const EXPLORERS = [
  new UserIdExplorer(),
];

const impressionHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const campaign = request.params.campaign;
  const event = await (new ImpressionEvent(campaign))
    .fromRequest(request)
    .explore(EXPLORERS);
  
  // Write impression event
  this.trackService.pushEvent(event);
  reply.type('image/gif').send(GIF_PIXEL_BUFF);
};

const clickHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const campaign = request.params.campaign;
  const targetUrl = this.trackService.buildTargetUrl(request.query.target);
  const redirectType: RedirectType = request.query.rt || RedirectType.ProxyPage;

  const event = await (new ClickEvent(campaign))
    .fromRequest(request)
    .explore(EXPLORERS);
  
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

const transitionHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {

  const url = request.params.url;

  const event = await (new TransitionEvent(url))
    .fromRequest(request)
    .explore(EXPLORERS);

  const targetUrl = this.trackService.buildTargetUrl(request.query.target);
  reply.redirect(targetUrl);

  // Write transition event
  this.trackService.pushEvent(event);
};

const conversionHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  //const event = new EventModel(EventType.Conversion, request);  
  reply.type('image/gif').send(GIF_PIXEL_BUFF);

  // Write conversion event
  this.trackService.pushEvent(event);
};
