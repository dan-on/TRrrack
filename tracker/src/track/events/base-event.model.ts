import { IEvent } from "./event.interface";
import { EventType } from "./event-type.enum";
import { DefaultHeaders, DefaultQuery, DefaultParams } from "fastify";

export class BaseEvent implements IEvent {
  id: string;
  time: number;

  constructor(
    public type: EventType,
    public headers: DefaultHeaders, 
    public query: DefaultQuery, 
    public params: DefaultParams, 
    public cookies: Object) {

    const now = Date.now();
    this.id = this.generateId(now);
    this.time = now;
  }

  /**
   * Genetate 16-digits ID 
   */
  private generateId(time: number): string {
    
    // Generate day index string from timestamp (4 - digits length)
    const unixtimeSeconds = Math.floor(time / 1000);
    const dayIndex = Math.floor(unixtimeSeconds / (3600 * 24));
    const dayIndexString = dayIndex.toString(36).padEnd(4, '0');
    
    if(dayIndexString.length !== 4) throw new Error('Wrong time');

    // Generate 2 random strings with 6 digits
    const maxRand = 2176782335; // Or: parseInt('zzzzzz', 36);
    const firstString = Math.floor(Math.random() * maxRand).toString(36).padStart(6, '0')
    const secondString = Math.floor(Math.random() * maxRand).toString(36).padStart(6, '0')

    return [
      dayIndexString, // 4 digits
      firstString,    // 6 digits
      secondString,   // 6 digits
    ].join('');
  }
}