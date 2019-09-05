import { IResolver } from "track/interfaces/resolver.interface";
import { IEvent } from "track/interfaces/event.interface";

export class MaxMindGeoResolver implements IResolver {
  
  property = 'mm_geo';

  async resolve(event: IEvent) {
    return 123;
  }
}