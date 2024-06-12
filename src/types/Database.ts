export interface RawServerDatabaseList {
    object: "list";
    data: Array<RawServerDatabase>;
}

export interface RawServerDatabase {
    object: "server_database";
    attributes: ServerDatabaseAttributes;
}

export interface ServerDatabaseAttributes {}