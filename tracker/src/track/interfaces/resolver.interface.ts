import { IEvent } from "track/interfaces/event.interface";

export interface IResolver {
  
  property: string;
  
  resolve(event: IEvent): Promise<any>;
}