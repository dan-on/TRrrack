import { IEvent } from "track/events/event.interface";
import { IExplorer } from "./explorer.interface";

export interface IExplorable {
  
  explored: Map<string, object>;

  explore(explorers: IExplorer[]): Promise<IEvent>;
}