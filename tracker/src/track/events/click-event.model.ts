import { BaseEvent } from "./base-event.model";
import { EventType } from "../enum/event-type.enum";

export class ClickEvent extends BaseEvent {

  constructor(public campaign: string) {
    super(EventType.Click);
  }
}