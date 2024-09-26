import { AxiosRequestConfig } from 'axios';
import { ApiRequestHandler } from '../functions/axois';

export type ClientOptions = {
  apikey: string;
  panel: string;
};

export class BaseClient {
  protected apikey: string;
  public panel: string;
  public api = async function api(
    config: AxiosRequestConfig,
    errorSet?: Array<{ code: number; message: string }>,
    ignoredErrors?: Array<string>,
  ): Promise<any> {};
  constructor(options: ClientOptions) {
    this.apikey = 'Bearer ' + options.apikey;
    this.panel = new URL(options.panel).origin;
    this.api = new ApiRequestHandler(this.apikey).axiosRequest;
    try {
      new URL(this.panel);
    } catch (error) {
      throw new Error('Invalid panel url');
    }
  }
}
