import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

const UID_TTL = 60 * 60 * 24 * 90 // 90 days
const SID_TTL = 60 * 60 // 1 hour
/**
 * Generate 8-digits random id
 */
function _generateId(): string {
  const maxInt = 2821109907455; // Or: parseInt('zzzzzzzz', 36);
  return Math.floor(Math.random() * maxInt)
    .toString(36)
    .split('')
    .map(x => Math.random() >= 0.5 ? x.toUpperCase() : x)
    .join('')
    .padStart(8, '0');
}

export async function attachUserId (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  
  if('uid' in request.cookies) {
    request['uid'] = request.cookies['uid'];
  } else {
    request['uid'] = _generateId();
  }

  reply.setCookie('uid', request['uid'], { maxAge: UID_TTL, path: '/' })
}

export async function attachSessionId (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
  
  if('sid' in request.cookies) {
    request['sid'] = request.cookies['sid'];
  } else {
    request['sid'] = _generateId();
  }
  
  reply.setCookie('sid', request['sid'], { maxAge: SID_TTL, path: '/' })
}