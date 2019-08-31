import { IEvent } from "track/events/event.interface";

export class UserIdExplorer {

  property = "userId";

  async explore(event: IEvent) {
    
    if('uid' in event.cookies) {
      return {
        id: event.cookies['uid'],
        isNewlyGenerated: false
      }
    }
    
    return {
      id: this.generateUserId(),
      isNewlyGenerated: true
    }
  }

  /**
   * Generate 8-digits unique id
   */
  private generateUserId() {
    
    const maxInt = 2821109907455; // Or: parseInt('zzzzzzzz', 36);

    return Math.floor(Math.random() * maxInt)
      .toString(36)
      .split('')
      .map(x => Math.random() > 0.5 ? x.toUpperCase() : x)
      .join('')
      .padStart(8, '0');
  }
}