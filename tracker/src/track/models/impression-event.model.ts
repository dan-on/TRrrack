import { BaseEvent } from "./base-event.model";
import { EventType } from "../enum/event-type.enum";

export class ImpressionEvent extends BaseEvent {
  constructor(public campaign: string) {
    super(EventType.Impression);
  }
}