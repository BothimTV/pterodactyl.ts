import { RawDatabasePassword } from './databasePassword';

export interface RawServerDatabaseList {
  object: 'list';
  data: Array<RawServerDatabase>;
}

export interface RawServerDatabase {
  object: 'server_database';
  attributes: ServerDatabaseAttributes;
}

export interface ServerDatabaseAttributes {
  readonly id: string;
  readonly host: {
    readonly address: string;
    readonly port: 3306 | string;
  };
  readonly name: string;
  readonly username: string;
  readonly connections_from: '%' | string;
  readonly max_connections: number;
  readonly relationships?: {
    password?: RawDatabasePassword;
  };
}
