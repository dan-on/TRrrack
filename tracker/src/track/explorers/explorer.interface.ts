import { IEvent } from "track/events/event.interface";

export interface IExplorer {
  
  property: string;
  
  explore(event: IEvent)
}