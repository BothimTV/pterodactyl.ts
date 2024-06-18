export interface RawServerDatabaseList {
    object: "list";
    data: Array<RawServerDatabase>;
}

export interface RawServerDatabase {
    object: "server_database";
    attributes: ServerDatabaseAttributes;
}

export interface ServerDatabaseAttributes {
    readonly id: number;
    readonly server: number;
    readonly host: number;
    readonly database: string;
    readonly username: string;
    readonly remote: string;
    readonly max_connections: number;
    readonly created_at: string | Date; 
    updated_at: string | Date; 
    readonly relationships?: { 
      readonly password: {
        readonly object: "database_password";
        readonly attributes: {
          password: string;
        };
      };
      readonly host?: {
        readonly object: "database_host";
        readonly attributes: {
          readonly id: number;
          readonly name: string;
          readonly host: string;
          readonly port: number;
          readonly username: string;
          readonly node: number;
          readonly created_at: string; 
          readonly updated_at: string; 
        };
      };
    };
}