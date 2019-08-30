import { IEvent } from "track/events/event.interface";

export interface IExplorable {
  
  explored: Map<string, object>;

  explore(): Promise<IEvent>;
}