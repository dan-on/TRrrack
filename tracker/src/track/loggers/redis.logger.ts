import { IEventLogger } from '../interfaces/logger.interface';
import { IEvent } from '../interfaces/event.interface';
import { RedisClient } from 'redis';
import * as util from 'util';

const REDIS_EVENTS_KEY = 'events';

export class RedisEventLogger implements IEventLogger {

  constructor(
    private readonly redis: RedisClient
  ) {}

  /**
   * Push event item to end of list
   * @param event 
   */
  log(event: IEvent) {
    const push = util.promisify(this.redis.lpush).bind(this.redis);
    return push(REDIS_EVENTS_KEY, JSON.stringify(event));
  }

  /**
   * Get event items from begin of list
   * @param amount 
   */
  async take(amount: number) {
    const take = util.promisify(this.redis.lrange).bind(this.redis);
    const eventItems = await take(REDIS_EVENTS_KEY, amount * -1, -1);
    return eventItems.map((item: string) => <IEvent>JSON.parse(item));
  }

  /**
   * Remove event items from begin of list
   * @param amount 
   */
  async splice(amount: number) {
    const trim = util.promisify(this.redis.ltrim).bind(this.redis);
    return trim(REDIS_EVENTS_KEY, 0, amount * -1 - 1);
  }
}