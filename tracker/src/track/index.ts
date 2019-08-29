import { clickSchema, transitionSchema, conversionSchema, impressionSchema } from './schemas';
import { EventType } from './enum/event-type.enum';
import { EventModel } from './models/event.model';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import * as crypto from 'crypto';
import { RedirectType } from './enum/redirect-type.enum';
import { readFileSync } from 'fs';

export async function registerHandlers (fastify, opts) {
  // Update our property
  fastify.addHook('preHandler', preHandler);
  fastify.get('/click/:campaign', clickSchema, clickHandler);
  fastify.get('/impression/:campaign', impressionSchema, impressionHandler);
  fastify.post('/transition/:campaign', transitionSchema, transitionHandler);
  fastify.get('/conversion/:clickId', conversionSchema, conversionHandler);
}

const PROXYPAGE_TPL = readFileSync('./src/track/static/proxypage.html')

// Beautiful pixel...
const GIF_PIXEL_BUFF = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 
  0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 
  0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 
  0x02, 0x44, 0x01, 0x00, 0x3b]);

const SESSION_ID_TTL = 60 * 30        // 30 minutes
const SESSION_ID_SIZE = 8             // 8 bytes
const USER_ID_TTL = 60 * 60 * 24 * 90 // 90 days
const USER_ID_SIZE = 8                // 8 bytes

const impressionHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const event = new EventModel(EventType.Impression, request);
  // Write impression event
  this.trackService.pushEvent(event);
  reply.type('image/gif').send(GIF_PIXEL_BUFF);
};

const clickHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const event = new EventModel(EventType.Click, request);
  event.params['clickId'] = this.trackService.buildClickId(event.time);

  const targetUrl = this.trackService.buildTargetUrl(request.query.target);
  const redirectType: RedirectType = request.query.rt || RedirectType.ProxyPage;
  
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
  const event = new EventModel(EventType.Transition, request);
  // Check session id (transition must have already generated sid)
  if('session' in request && request['session']['isNew'] === true) {
    reply.status(403).send('It looks like you have cookies turned off');
  }

  const targetUrl = this.trackService.buildTargetUrl(request.query.target);
  reply.redirect(targetUrl);

  // Write transition event
  this.trackService.pushEvent(event);
};

const conversionHandler = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  const event = new EventModel(EventType.Conversion, request);  
  reply.type('image/gif').send(GIF_PIXEL_BUFF);

  // Write conversion event
  this.trackService.pushEvent(event);
};

const preHandler = async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>, done) => {
  // Generate new or update sessionId
  buildSessionId(request, reply);
  // Generate new or update userId
  buildUserId(request, reply);
  done()
}

const buildUserId = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  if('uid' in request.cookies) {
    request['user'] = { id: request.cookies.sid, isNew: false };
    reply.setCookie('uid', request['user']['id'], { maxAge: USER_ID_TTL, path: '/' });
  } else {
    const userId = crypto.randomBytes(USER_ID_SIZE).toString('hex');
    request['user'] = { id: userId, isNew: true };
    reply.setCookie('uid', request['user']['id'], { maxAge: USER_ID_TTL, path: '/' });  
  }
};

const buildSessionId = async function(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  if('sid' in request.cookies) {
    request['session'] = { id: request.cookies.sid, isNew: false };
    reply.setCookie('sid', request['session']['id'], { maxAge: SESSION_ID_TTL, path: '/' });
  } else {
    const sessionId = crypto.randomBytes(SESSION_ID_SIZE).toString('hex');
    request['session'] = { id: sessionId, isNew: true };
    reply.setCookie('sid', request['session']['id'], { maxAge: SESSION_ID_TTL, path: '/' });  
  }
}
