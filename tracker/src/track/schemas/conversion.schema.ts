import * as fastify from 'fastify'

export const conversionSchema: fastify.RouteShorthandOptions = {
  schema: {
    params: {
      clickId: { type: 'string' },
    }
  }
};