import { RawDatabasePassword } from "../types/user/databasePassword";
import {
  RawServerDatabase,
  ServerDatabaseAttributes,
} from "../types/user/serverDatabase";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient;
var relationships:
  | {
      password?: RawDatabasePassword;
    }
  | undefined;
export class Database implements ServerDatabaseAttributes {
  readonly id: string;
  readonly host: {
    readonly address: string;
    readonly port: string | 3306;
  };
  readonly name: string;
  readonly username: string;
  readonly connections_from: string;
  readonly max_connections: number;
  password?: string;
  readonly parentServer: Server;

  constructor(
    userClient: UserClient,
    databaseProps: RawServerDatabase,
    parentServer: Server,
  ) {
    client = userClient;
    this.id = databaseProps.attributes.id;
    this.host = databaseProps.attributes.host;
    this.name = databaseProps.attributes.name;
    this.username = databaseProps.attributes.username;
    this.connections_from = databaseProps.attributes.connections_from;
    this.max_connections = databaseProps.attributes.max_connections;
    relationships = databaseProps.attributes.relationships;
    this.parentServer = parentServer;
    this.password =
      databaseProps.attributes.relationships?.password?.attributes.password;
  }

  /**
   * Rotates the password for this database
   * @returns The new generated password or undefined if the user doesn't have the permission to view the password
   */
  public async rotatePassword(): Promise<string | undefined> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/databases/" +
        this.id +
        "/rotate-password",
    );
    const res = (await client.api({
      url: endpoint.href,
      method: "POST",
    })) as RawServerDatabase;
    this.password = res.attributes.relationships?.password?.attributes.password;
    relationships = res.attributes.relationships;
    return relationships?.password?.attributes.password;
  }

  /**
   * Deletes this database
   */
  public async delete(): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/databases/" +
        this.id,
    );
    await client.api({ url: endpoint.href, method: "DELETE" });
  }
}
