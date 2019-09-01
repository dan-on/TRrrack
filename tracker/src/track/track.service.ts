import { IEvent } from './events/event.interface';
import { IEventLogger } from './loggers/logger.interface';
import { IExplorer } from './explorers/explorer.interface';
import { IExplorable } from './explorers/explorable.interface';

export class TrackService {

  private explorers: IExplorer[] = [];

  constructor(private readonly eventWriter: IEventLogger) {}
  
  useExplorers(explorers: IExplorer[]): void {
    this.explorers = explorers;
  }

  exploreEvent(event: IExplorable) {
    return event.explore(this.explorers);
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