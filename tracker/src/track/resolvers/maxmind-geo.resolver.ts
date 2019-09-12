import { IResolver } from "track/interfaces/resolver.interface";
import { IEvent } from "track/interfaces/event.interface";
import { Reader, CityResponse } from "maxmind";

export class MaxmindGeoResolver implements IResolver {
  
  property = 'geoMaxmind';

  constructor(private readonly maxmindReader: Reader<CityResponse>) {
  }

  async resolve(event: IEvent) {
    this.maxmindReader.get(event.ip);
  }
}