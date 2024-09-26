import { BaseClient, ClientOptions } from '../BaseClient/BaseClient';
import { RawServer, RawServerList } from '../types/user/server';
import { RawUser } from '../types/user/user';
import { Server } from './Server';
import { User } from './User';

export class UserClient extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }

  /**
   * Get the account this api key is assigned to
   */
  public async getAccount() {
    const endpoint = new URL(this.panel + '/api/client/account');
    return new User(this, (await this.api({ url: endpoint.href })) as RawUser);
  }

  /**
   * Get all Servers on this account
   */
  public async getServers(): Promise<Array<Server>> {
    const endpoint = new URL(this.panel + '/api/client');
    return ((await this.api({ url: endpoint.href })) as RawServerList).data.map((server) => new Server(this, server));
  }

  /**
   * Get a Server on this account
   */
  public async getServer(id: string): Promise<Server> {
    const endpoint = new URL(this.panel + '/api/client/servers/' + id);
    return new Server(this, (await this.api({ url: endpoint.href })) as RawServer);
  }
}
