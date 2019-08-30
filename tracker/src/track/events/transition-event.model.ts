import { BaseEvent } from "./base-event.model";
import { EventType } from "./event-type.enum";

export class TransitionEvent extends BaseEvent {
  constructor(public url: string) {
    super(EventType.Impression);
  }
}