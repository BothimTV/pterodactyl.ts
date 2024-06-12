import { AxiosRequestConfig } from "axios";
import { ClientOptions } from "../../types/Util";
import { ApiRequestHandler } from "../functions/axois";

export class UserClient {
    protected apikey: string;
    public panel: string;
    public api = async function api(config: AxiosRequestConfig, errorSet?: Array<{ code: number; message: string; }>, ignoredErrors?: Array<string>): Promise<any> { };

    constructor(options: ClientOptions) {
        this.apikey = "Bearer " + options.apikey;
        this.panel = options.panel;
        this.api = new ApiRequestHandler(this.apikey).axiosRequest
        try {
          new URL(this.panel);
        } catch (error) {
          throw new Error("Invalid panel url");
        }
      }
}