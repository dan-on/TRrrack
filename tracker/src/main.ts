import { ConfigService } from 'config/config.service'; 
import * as fastify from 'fastify';
import { registerHandlers } from './track';
import { TrackService } from './track/track.service';
import { RedisClient } from 'redis';
import { RedisEventLogger } from 'track/loggers/redis.logger';
import { DeviceTypeExplorer } from 'track/explorers/device-type.explorer';

async function bootstrap() {
  
  // Bootstrap event writer (redis by default)
  const redisClient = new RedisClient({
    host: 'localhost',
    port: 6379
  });
  const eventWriter = new RedisEventLogger(redisClient);
  
  // Bootstrap tracking service
  const trackService = new TrackService(eventWriter);
  trackService.useExplorers([
    DeviceTypeExplorer
  ]);

  // Bootstrap config service
  const configService = new ConfigService();
  
  // Initialize Fastify server
  const server = fastify({
    "maxParamLength": 2048,
    "trustProxy": true
  });
  server.register(require('fastify-cookie'))
  
  server.decorate('trackService', trackService);
  server.decorate('configService', configService);
  
  server.register(registerHandlers, { prefix: '/' });
  await server.listen(3001, '0.0.0.0');
  console.log('Track Server Started');
}

bootstrap();