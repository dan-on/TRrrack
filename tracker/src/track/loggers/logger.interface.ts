import { IEvent } from '../events/event.interface';

export interface IEventLogger {
  
  log(event: IEvent): Promise<any>;

  take(amount: number): Promise<IEvent[]>;
    
  splice(amount: number): Promise<any>;
}
