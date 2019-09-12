import { ConfigService } from 'config/config.service'; 
import * as fastify from 'fastify';
import { registerHandlers } from './track';
import { TrackService } from './track/track.service';
import { RedisClient } from 'redis';
import { RedisEventLogger } from 'track/loggers/redis.logger';
import { UaParserResolver } from 'track/resolvers/uaparser.resolver';
import maxmind, { CityResponse } from 'maxmind';
import { MaxmindGeoResolver } from 'track/resolvers/maxmind-geo.resolver';

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

  // Init resolvers
  const maxmindCityDbPath = configService.get('MAXMIND_CITY_DB_PATH');
  const cityLookup = await maxmind.open<CityResponse>(maxmindCityDbPath);
  
  trackService.useResolvers([
    new UaParserResolver(),
    new MaxmindGeoResolver(cityLookup),
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