import { IEventLogger } from '../interfaces/logger.interface';
import { IEvent } from '../interfaces/event.interface';

export class MemoryEventLogger implements IEventLogger {

  private _log: IEvent[] = [];

  /**
   * Push event item to end of list
   * @param event 
   */
  async log(event: IEvent) {
    return this._log.push(event);
  }

  /**
   * Get event items from begin of list
   * @param amount 
   */
  async take(amount: number) {
    return this._log.slice(0, amount);
  }

  /**
   * Remove event items from begin of list
   * @param amount 
   */
  async splice(amount: number) {
    return this._log.splice(0, amount);
  }
}