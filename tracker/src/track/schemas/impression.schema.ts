import * as fastify from 'fastify'

export const impressionSchema: fastify.RouteShorthandOptions = {
  schema: {
    params: {
      campaign: { type: 'string', minLength: 3 },
    }
  }
};