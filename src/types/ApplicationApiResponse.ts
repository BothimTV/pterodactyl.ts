import { DatabaseList } from "./BaseApiResponse";

export type UserList = {
  object: "list";
  data: Array<User>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type User = {
  object: "user";
  attributes: {
    id: number;
    external_id: null | string;
    uuid: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: "en" | string;
    root_admin: boolean;
    "2fa": boolean;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
  };
};

export type CreateUser = User & {
  meta: {
    resource: string;
  };
};

export type NodeList = {
  object: "list";
  data: Array<Node>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Node = {
  object: "node";
  attributes: {
    id: number;
    uuid: string;
    public: boolean;
    name: string;
    description: string;
    location_id: number;
    fqdn: string;
    scheme: "http" | "https";
    behind_proxy: boolean;
    maintenance_mode: boolean;
    memory: number;
    memory_overallocate: number;
    disk: number;
    disk_overallocate: number;
    upload_size: number;
    daemon_listen: 8080 | number;
    daemon_sftp: 2022 | number;
    daemon_base: string;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
    allocated_resources: {
      memory: number;
      disk: number;
    };
  };
};

export type NodeConfiguration = {
  debug: boolean;
  uuid: string;
  token_id: string;
  token: string;
  api: {
    host: string;
    port: 8080 | number;
    ssl: {
      enabled: boolean;
      cert: string;
      key: string;
    };
    upload_limit: number;
  };
  system: {
    data: string;
    sftp: {
      bind_port: 2022 | number;
    };
  };
  remote: string;
};

export type CreateNode = Node & {
  attributes: {
    allocated_resources: {
      memory: number;
      disk: number;
    };
  };
  meta: {
    resource: string;
  };
};

export type AllocationList = {
  object: "list";
  data: Array<Allocation>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Allocation = {
  object: "allocation";
  attributes: {
    id: number;
    ip: string;
    alias: null | string;
    port: number;
    notes: null | string;
    assigned: boolean;
  };
};

export type LocationList = {
  object: "list";
  data: Array<Location>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Location = {
  object: "location";
  attributes: {
    id: number;
    short: string;
    long: string;
    updated_at: string; // FIXME: Is a timestamp
    created_at: string; // FIXME: Is a timestamp
  };
};

export type CreateLocation = Location & {
  meta: {
    resource: string;
  };
};

export type ServerList = {
  object: "list";
  data: Array<Server>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Server = {
  object: "server";
  attributes: {
    id: number;
    external_id: string;
    uuid: string;
    identifier: string;
    name: string;
    description: string;
    suspended: boolean;
    limits: {
      memory: number;
      swap: number;
      disk: number;
      io: number;
      cpu: number;
      threads: null;
    };
    feature_limits: {
      databases: number;
      allocations: number;
      backups: number;
    };
    user: number;
    node: number;
    allocation: number;
    nest: number;
    egg: number;
    pack: null;
    container: {
      startup_command: string;
      image: string;
      installed: true;
      environment: any;
    };
    updated_at: string; // FIXME: Is a timestamp
    created_at: string; // FIXME: Is a timestamp
    relationships: {
      databases: DatabaseList;
    };
  };
};

export type FullDatabaseList = {
  object: "list";
  data: Array<ServerDatabase>;
};

export type ServerDatabase = {
  object: "server_database";
  attributes: {
    id: number;
    server: number;
    host: number;
    database: string;
    username: string;
    remote: string;
    max_connections: number;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
    relationships: {
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
          created_at: string; // FIXME: Is a timestamp
          updated_at: string; // FIXME: Is a timestamp
        };
      };
    };
  };
};

export type CreateDatabase = {
  object: "server_database";
  attributes: {
    id: number;
    server: number;
    host: number;
    database: string;
    username: string
    remote: "%" | string;
    max_connections: null | number;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
  };
  meta: {
    resource: string
  };
};

export type NestList = {
  object: "list";
  data: Array<Nest>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Nest = {
  object: "nest";
  attributes: {
    id: number;
    uuid: string;
    author: string;
    name: string;
    description: string;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
  };
};

export type EggList = {
  object: "list";
  data: Array<Egg>;
};

export type Egg = {
  object: "egg";
  attributes: {
    id: number;
    uuid: string;
    name: string;
    nest: number;
    author: string;
    description: string;
    docker_image: string;
    config: {
      files: any;
    };
    startup: {
      done: string;
      userInteraction?: Array<string>;
    };
    stop: string;
    logs: {
      custom: boolean;
      location: string;
    };
    extends: null | any;
  };
  startup: string;
  script: {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends: null | any;
  };
  created_at: string; // FIXME: Is a timestamp
  updated_at: string; // FIXME: Is a timestamp
  relationships: {
    nest: Nest;
    servers: ServerList;
  };
};
