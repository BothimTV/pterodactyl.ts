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
