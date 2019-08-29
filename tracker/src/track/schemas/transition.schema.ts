import * as fastify from 'fastify'

export const transitionSchema: fastify.RouteShorthandOptions = {
  schema: {
    params: {
      campaign: { type: 'string', minLength: 3 },
    },
    querystring: {
      target: { type: 'string', minLength: 10 }
    }
  }
};