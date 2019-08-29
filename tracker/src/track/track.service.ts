import { IEvent } from './events/event.interface';
import { IEventLogger } from './loggers/logger.interface';

export class TrackService {
  constructor(private readonly eventWriter: IEventLogger) {}
  
  pushEvent(event: IEvent) {
    this.eventWriter.log(event);
  }

  buildTargetUrl(encodedUrl: string, event: IEvent): string {
    return "url";
    // const targetUrlTemplate = url.parse(Buffer.from(encodedUrl, 'base64').toString('ascii'));
    // return targetUrlTemplate.expand(event);
  }
}