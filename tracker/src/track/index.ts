import { clickSchema, transitionSchema, conversionSchema, impressionSchema } from './schemas';
import * as handlers from './handlers';
import { attachUserId, attachSessionId } from './pre-handlers';

export async function registerHandlers (fastify, opts) {
  fastify.get('/click/:campaign', clickSchema, handlers.clickHandler);
  fastify.get('/impression/:campaign', impressionSchema, handlers.impressionHandler);
  fastify.get('/transition/:campaign', transitionSchema, handlers.transitionHandler);
  fastify.get('/conversion/:clickId', conversionSchema, handlers.conversionHandler);

  fastify.addHook('preHandler', attachUserId);
  fastify.addHook('preHandler', attachSessionId);
}

