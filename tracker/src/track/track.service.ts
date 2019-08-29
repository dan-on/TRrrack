import { IEventLogger } from './event-loggers/event-logger.interface';
import { IEvent } from './interfaces/event.interface';
import * as url from 'url-template';

export class TrackService {
  constructor(private readonly eventWriter: IEventLogger) {}
  
  pushEvent(event: IEvent) {
    this.eventWriter.logEvent(event);
  }

  buildTargetUrl(encodedUrl: string, event: IEvent): string {
    const targetUrlTemplate = url.parse(Buffer.from(encodedUrl, 'base64').toString('ascii'));
    return targetUrlTemplate.expand(event);
  }

  /**
   * 16-digit ClickId generator
   * @param time unix timestamp (seconds)
   */
  buildClickId(time: number): string {
    
    const minRand = parseInt('100000', 36);
    const maxRand = parseInt('zzzzzz', 36);
    const timeChunkString = Math.floor(time / 3600 * 24).toString(36);
    const firstRandomString = Math.ceil(Math.random() * (maxRand - minRand) + minRand).toString(36);
    const secondRandomString = Math.ceil(Math.random() * (maxRand - minRand) + minRand).toString(36);
    
    if(timeChunkString.length !== 5) {
      throw new Error('Wrong time');
    }

    return [
      timeChunkString, // 5 digits
      firstRandomString, // 6 digits
      secondRandomString, // 6 digits
    ].join('').substr(0, 16);
  }
}