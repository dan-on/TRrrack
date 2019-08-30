import { IEvent } from "./event.interface";
import { EventType } from "./event-type.enum";
import { DefaultHeaders, DefaultQuery, DefaultParams, FastifyRequest } from "fastify";
import { FastifyCookieOptions } from 'fastify-cookie';
import { IExplorer } from "track/explorers/explorer.interface";
import { IExplorable } from "track/explorers/explorable.interface";

export class BaseEvent implements IEvent {

  id: string;
  time: number;
  headers: DefaultHeaders;
  query: DefaultQuery;
  params: DefaultParams;
  cookies: object;
  explored: Map<string, object>;

  constructor(public type: EventType) {
    const now = Date.now();
    this.id = this.generateId(now);
    this.time = now;
  }

  /**
   * Initialize event from request object
   */
  public fromRequest(request: FastifyRequest<FastifyCookieOptions>) {
    
    this.headers = request.headers;
    this.query = request.query;
    this.params = request.params;
    this.cookies = request.cookies;

    return this;
  }

  /**
   * Explore event data with explorers
   */
  public async explore(explorers: IExplorer[]): Promise<IEvent> {
  
    const exploredData = await Promise.all(explorers.map(e => e.explore(this)));
    const mapped = string[][] explorers.map((e, index) => [e.property, exploredData[index]]);
    this.explored = new Map(mapped);
    new Map([[1,2], [1,3]])
    return this;
  }

  /**
   * Generate 16-digits ID
   */
  private generateId(time: number): string {
    
    const encodedDate = this.encodeDate(time);
    const firstKeyMaxInt = 2176782335; // Or: parseInt('zzzzzz', 36);
    const secondKeyMaxInt = 60466175; // Or: parseInt('zzzzz', 36);
    
    if(encodedDate.length !== 5) throw new Error('Wrong event time');

    return [
      encodedDate, // 5 digits
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