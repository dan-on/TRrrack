export interface IEvent {
  type: string;
  time: number;
  headers: object;
  query: object;
  params: object;
  cookies: object;
}