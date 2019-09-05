import { IEvent } from './interfaces/event.interface';
import { IEventLogger } from './interfaces/logger.interface';
import { IResolver } from './interfaces/resolver.interface';
import { BaseEvent } from './models';

export class TrackService {

  private resolvers: IResolver[] = [];

  constructor(private readonly eventWriter: IEventLogger) {}
  
  useResolvers(resolvers: IResolver[]): void {
    this.resolvers = resolvers;
  }

  resolveEvent(event: BaseEvent) {
    return event.resolve(this.resolvers);
  }

  pushEvent(event: IEvent) {
    this.eventWriter.log(event);
  }

  buildTargetUrl(encodedUrl: string, event: IEvent): string {
    return "url";
    // const targetUrlTemplate = url.parse(Buffer.from(encodedUrl, 'base64').toString('ascii'));
    // return targetUrlTemplate.expand(event);
  }
}