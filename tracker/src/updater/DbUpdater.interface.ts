import { DbCompression } from "./DbCompression.enum";

export interface IDbUpdater {
  
  md5FileUrl?: string;
  dbFileUrl: string;
  compression: DbCompression;
  filesPattern: string;
  
  update(): Promise<any>;
}