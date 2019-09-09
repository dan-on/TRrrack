import { ConfigService } from 'config/config.service'; 
import * as fastify from 'fastify';
import { registerHandlers } from './track';
import { TrackService } from './track/track.service';
import { RedisClient } from 'redis';
import { RedisEventLogger } from 'track/loggers/redis.logger';
import { DeviceTypeResolver } from 'track/resolvers/device-type.resolver';
import { config } from 'dotenv';

async function bootstrap() {

  // Bootstrap config service
  const configService = new ConfigService();
  
  // Bootstrap event writer (redis by default)
  const redisClient = new RedisClient({
    host: configService.get('REDIS_HOST'),
    port: +configService.get('REDIS_PORT')
  });
  const eventWriter = new RedisEventLogger(redisClient);
  
  // Bootstrap tracking service
  const trackService = new TrackService(eventWriter);
  trackService.useResolvers([
    new DeviceTypeResolver()
  ]);

  // Initialize Fastify server
  const server = fastify({
    "maxParamLength": 2048,
    "trustProxy": true
  });
  server.register(require('fastify-cookie'))
  
  server.decorate('trackService', trackService);
  server.decorate('configService', configService);
  
  server.register(registerHandlers, { prefix: '/' });
  await server.listen(3000, '0.0.0.0');
  console.log('Track Server Started');
}

bootstrap();