export type UserCreateProperties = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};

export type UserUpdateProperties = {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  language?: "en" | string;
  password?: string;
};

export type NodeCreateProperties = {
  name: string;
  location_id: number;
  fqdn: string;
  scheme: "https" | "http";
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: 100 | number;
  daemon_sftp: 2022 | number;
  daemon_listen: 8080 | number;
};

export type NodeUpdateProperties = {
  name: string;
  description: string;
  location_id: number;
  fqdn: string;
  scheme: "https" | "http";
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: 100 | number;
  daemon_sftp: 2022 | number;
  daemon_listen: 8080 | number;
};

export type AllocationCreateProperties = {
  ip: string;
  ports: Array<string>;
};

export type LocationCreateProperties = {
  short: string;
  long: string;
};

export type LocationUpdateProperties = {
  short?: string;
  long?: string;
};

export type ServerCreateProperties = {
  name: string;
  user: number;
  egg: number;
  docker_image: string;
  startup: string;
  environment: any;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  feature_limits: {
    databases: number;
    backups: number;
    allocations: number;
  };
  allocation: {
    default: number;
  };
};

export type ServerUpdateProperties = {
  name: string;
  user: number;
  external_id: string;
  description: string;
};

export type ServerUpdateBuildProperties = {
  allocation: number;
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads?: string;
  feature_limits: {
    databases?: number;
    allocations?: number;
    backups?: number;
  };
};

export type ServerUpdateStartupProperties = {
  startup: string;
  environment: any;
  egg: number;
  image: string;
  skip_scripts: boolean;
};

export type ServerDatabaseCreateProperties = {
  database: string;
  remote: "%" | string;
  host: number;
};
