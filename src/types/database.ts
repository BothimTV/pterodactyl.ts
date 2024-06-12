export interface RawServerDatabaseList {
    object: "list";
    data: Array<RawServerDatabase>;
}

export interface RawServerDatabase {
    object: "server_database";
    attributes: ServerDatabaseAttributes;
}

export interface ServerDatabaseAttributes { // TODO: Test the api endpoints to get a verified response 
    id: number;
    server: number;
    host: number;
    database: string;
    username: string;
    remote: string;
    max_connections: number;
    created_at: string | Date; 
    updated_at: string | Date; 
    relationships?: { 
      password: {
        object: "database_password";
        attributes: {
          password: string;
        };
      };
      host: {
        object: "database_host";
        attributes: {
          id: number;
          name: string;
          host: string;
          port: number;
          username: string;
          node: number;
          created_at: string; 
          updated_at: string; 
        };
      };
    };
}