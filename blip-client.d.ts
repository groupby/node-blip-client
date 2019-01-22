
declare module 'blip-client' {
  export interface IBlipClient {
    write(data: { date: string; } & Record<string, any>): Promise<any>;
  }

  export function createClient(
    host: string, 
    port: number, 
    clientService: string, 
    clientEnviroment: string): IBlipClient;
}
