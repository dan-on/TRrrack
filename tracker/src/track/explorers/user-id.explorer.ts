import { IEvent } from "track/events/event.interface";

export class UserIdExplorer {

  property = "user"

  async explore(event: IEvent) {
    return {
      'id': 123,
      'wasGeneratedNow': true
    }
  }
}