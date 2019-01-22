
declare module 'blip-client'
{
  export interface IBlipClient {
    write(data: any): void;
  }

 export function createClient(
  host: string, 
  port: number, 
  clientService: string, 
  clientEnviroment: string): IBlipClient;
 
}