import { IEvent } from "track/events/event.interface";

export class SessionIdExplorer {

  property = "sessionId";

  async explore(event: IEvent) {
    
    if('sid' in event.cookies) {
      return {
        id: event.cookies['sid'],
        isNewlyGenerated: false
      }
    }
    
    return {
      id: this.generateSessionId(),
      isNewlyGenerated: true
    }
  }

  /**
   * Generate 8-digits unique id
   */
  private generateSessionId() {
    
    const maxInt = 2821109907455; // Or: parseInt('zzzzzzzz', 36);

    return Math.floor(Math.random() * maxInt)
      .toString(36)
      .split('')
      .map(x => Math.random() > 0.5 ? x.toUpperCase() : x)
      .join('')
      .padStart(8, '0');
  }
}