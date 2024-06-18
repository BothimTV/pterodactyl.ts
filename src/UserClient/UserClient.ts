import { BaseClient, ClientOptions } from "../BaseClient/BaseClient";
import { RawServerList } from "../types/user/server";
import { Server } from "./Server";

export class UserClient extends BaseClient {
  constructor(options: ClientOptions) {
    super(options)
  }

  public async getServers(): Promise<Array<Server>> {
    const endpoint = new URL(this.panel + "/api/client");
    return (await this.api({ url: endpoint.href }) as RawServerList).data.map(server => new Server(this, server));
  }
}