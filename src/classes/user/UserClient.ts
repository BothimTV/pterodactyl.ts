import { ClientOptions } from "../../types/Util";

export class UserClient {
    protected apikey: string;
    protected panel: string;
    constructor(options: ClientOptions) {
      this.apikey = options.apikey;
      this.panel = options.panel;
    }
  }