export type DatabaseList = {
  object: "list";
  data: Array<Database>;
};

export type Database = {
  object: "server_database";
  attributes: {
    id: string;
    host: {
      address: string;
      port: number;
    };
    name: string;
    username: string;
    connections_from: string;
    max_connections: number;
  };
};
