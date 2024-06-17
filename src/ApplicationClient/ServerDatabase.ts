import { RawServerDatabase, ServerDatabaseAttributes } from "../types/database";
import { ApplicationClient } from "./ApplicationClient";

var client: ApplicationClient;
export class ServerDatabase implements ServerDatabaseAttributes {

  public readonly id: number;
  public server: number;
  public host: number;
  public database: string;
  public username: string;
  public remote: string;
  public max_connections: number;
  public created_at: Date
  public updated_at: Date
  public password?: string
  public dbHost?: {
    id: number;
    name: string;
    host: string;
    port: number;
    username: string;
    node: number;
    created_at: Date
    updated_at: Date
  };

  constructor(applicationClient: ApplicationClient, dbProperties: RawServerDatabase) {
    client = applicationClient;
    this.id = dbProperties.attributes.id;
    this.server = dbProperties.attributes.server;
    this.host = dbProperties.attributes.host;
    this.database = dbProperties.attributes.database;
    this.username = dbProperties.attributes.username;
    this.remote = dbProperties.attributes.remote;
    this.max_connections = dbProperties.attributes.max_connections;
    this.created_at = new Date(dbProperties.attributes.created_at);
    this.updated_at = new Date(dbProperties.attributes.updated_at);
    if (dbProperties.attributes.relationships) {
      this.password = dbProperties.attributes.relationships.password.attributes.password;
      if (dbProperties.attributes.relationships.host) {
        this.dbHost = {
          id: dbProperties.attributes.relationships.host.attributes.id,
          name: dbProperties.attributes.relationships.host.attributes.name,
          host: dbProperties.attributes.relationships.host.attributes.host,
          port: dbProperties.attributes.relationships.host.attributes.port,
          username: dbProperties.attributes.relationships.host.attributes.username,
          node: dbProperties.attributes.relationships.host.attributes.node,
          created_at: new Date(dbProperties.attributes.relationships.host.attributes.created_at),
          updated_at: new Date(dbProperties.attributes.relationships.host.attributes.updated_at)
        };
      }
    }
  }

  /**
  * Resets the password for the database
  */
  public async resetPassword(): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/servers/" + this.server + "/databases/" + this.id + "/reset-password");
    await client.api({ url: endpoint.href, method: "POST" })
  }

  /**
  * Delete this database
  */
  public async delete(): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/servers/" + this.server + "/databases/" + this.id);
    await client.api({ url: endpoint.href, method: "DELETE" })
  }

}