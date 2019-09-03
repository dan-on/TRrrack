import { IEvent } from "track/events/event.interface";
import { IExplorer } from "./explorer.interface";
import * as parser from 'ua-parser-js';

export class DeviceTypeExplorer implements IExplorer {
  
  property: string;
  
  /**
   * Parse user-agent
   * @param event 
   * @example https://github.com/faisalman/ua-parser-js#Methods
   */
  async explore(event: IEvent): Promise<any> {
    return parser(event.headers['user-agent']);
  }
}