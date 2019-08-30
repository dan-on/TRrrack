import { IEvent } from "track/events/event.interface";

export interface IExplorable {
  
  explored;

  explore(): Promise<IEvent>;
}