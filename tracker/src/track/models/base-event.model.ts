import { IEvent } from "../interfaces/event.interface";
import { EventType } from "../enum/event-type.enum";
import { DefaultHeaders, DefaultQuery, DefaultParams, FastifyRequest } from "fastify";
import { FastifyCookieOptions } from 'fastify-cookie';
import { IResolver } from "track/interfaces/resolver.interface";

export class BaseEvent implements IEvent {

  id: string;
  time: number;
  sid: string;
  uid: string;
  ip: string;
  headers: DefaultHeaders;
  query: DefaultQuery;
  params: DefaultParams;
  cookies: object;
  explored: Map<string, any>;

  constructor(public type: EventType) {
    const now = Date.now();
    this.id = this.generateId(now);
    this.time = now;
    this.explored = new Map();
  }

  /**
   * Initialize event from request object
   */
  public fromRequest(request: FastifyRequest<FastifyCookieOptions>) {
    
    this.uid = request['uid'];
    this.sid = request['sid'];
    this.ip = request.ip;
    this.headers = request.headers;
    this.query = request.query;
    this.params = request.params;
    this.cookies = request.cookies;

    return this;
  }

  /**
   * Resolve event data
   */
  public async resolve(resolvers: IResolver[]): Promise<any> {
    const exploredData = await Promise.all(resolvers.map(e => e.resolve(this)));
    exploredData.forEach((val, index) => {
      this.explored[resolvers[index].property] = val
    });
    return this;
  }

  /**
   * Generate 16-digits ID
   */
  private generateId(time: number): string {
    
    const encodedDate = this.encodeDate(time);
    const randomKey = this.randomKey();

    if(encodedDate.length !== 5) throw new Error('Wrong event time');

    return [
      encodedDate,  // 5 digits
      randomKey,    // 11 digits
    ].join('');
  }

  /**
   * Generate 11-digits base36 encoded string. Limit 
   * @param length
   */
  private randomKey(): string {
    const maxInt = Math.pow(36, 11) - 1;
    return Math.floor(Math.random() * maxInt)
      .toString(36)
      .padStart(11, '0');
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