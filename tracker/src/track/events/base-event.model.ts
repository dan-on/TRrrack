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
    
    const encodedDate = this.encodeDate(time);
    const firstKeyMaxInt = 2176782335; // Or: parseInt('zzzzzz', 36);
    const secondKeyMaxInt = 60466175; // Or: parseInt('zzzzz', 36);
    
    if(encodedDate.length !== 5) throw new Error('Wrong event time');

    return [
      this.encodeDate, // 5 digits
      this.randomKey(firstKeyMaxInt), // 6 digits
      this.randomKey(secondKeyMaxInt), // 5 digits
    ].join('');
  }

  /**
   * Generate base36 encoded string from random integer between 0 and maxInt
   * @param maxInt
   */
  private randomKey(maxInt: number): string {
    return Math.floor(Math.random() * maxInt).toString(36).padStart(6, '0');
  }

  /**
   * Generate base36 encoded UTC date string from timestamp
   * @param time
   */
  private encodeDate(time: number): string {
    
    // From: "2019-08-30T07:35:21.005Z" To: 20190830
    const dateInt = parseInt((new Date(time)).toISOString().split('T').shift().split('-').join(''));
    
    // Encode to base36
    // From: 20190839 To: "c0rce"
    return dateInt.toString(36);
  }
}