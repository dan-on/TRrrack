import * as fastify from 'fastify'

export const clickSchema: fastify.RouteShorthandOptions = {
  schema: {
    params: {
      campaign: { type: 'string', minLength: 3 }
    },
    querystring: {
      target: { type: 'string', minLength: 10 },
      src: { type: 'string', minLength: 3, maxLength: 3 },
    }
  }
};