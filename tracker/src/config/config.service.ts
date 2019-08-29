export class ConfigService
{
  get(key: string): string | undefined {
    return process.env[key];
  }
}