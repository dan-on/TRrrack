import { IEvent } from "track/interfaces/event.interface";
import { IResolver } from "../interfaces/resolver.interface";
import * as parser from 'ua-parser-js';

export class DeviceTypeResolver implements IResolver {
  
  property: string;
  
  /**
   * Parse user-agent
   * @param event 
   * @example https://github.com/faisalman/ua-parser-js#Methods
   */
  async resolve(event: IEvent): Promise<any> {
    return parser(event.headers['user-agent']);
  }
}