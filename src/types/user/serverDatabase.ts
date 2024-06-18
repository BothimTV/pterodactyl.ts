import { RawDatabasePassword } from "./databasePassword";

export interface RawServerDatabaseList {
  object: "list";
  data: Array<RawServerDatabase>;
}

export interface RawServerDatabase {
  object: "server_database";
  attributes: ServerDatabaseAttributes;
}

export interface ServerDatabaseAttributes {
  id: string;
  host: {
    address: string;
    port: 3306 | string;
  };
  name: string;
  username: string;
  connections_from: "%" | string;
  max_connections: number;
  relationships?: {
    password?: RawDatabasePassword;
  };
}
