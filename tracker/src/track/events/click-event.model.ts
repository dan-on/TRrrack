import { BaseEvent } from "./base-event.model";
import { EventType } from "./event-type.enum";

export class ClickEvent extends BaseEvent {
  constructor(public campaign: string) {
    super(EventType.Click);
  }
}