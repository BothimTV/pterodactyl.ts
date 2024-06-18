import { RawServerSubUserList } from "../application/serverSubUser";
import { ServerStatus } from "../base/serverStatus";
import { RawAllocationList } from "./allocation";
import { RawEgg } from "./egg";
import { RawEggVariableList } from "./eggVariable";

export interface RawServerList {
  object: "list";
  data: Array<RawServer>;
}

export interface RawServer {
  object: "server";
  attributes: ServerAttributes;
}

export interface ServerAttributes {
  server_owner: boolean;
  identifier: string;
  internal_id: number | string;
  uuid: string;
  name: string;
  node: string;
  is_node_under_maintenance: boolean;
  sftp_details: {
    ip: string;
    port: 2022 | number;
  };
  description: string;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: null | string;
    oom_disabled: boolean;
  };
  invocation: string;
  docker_image: string;
  egg_features: Array<string>;
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  status: null | ServerStatus;
  is_suspended: boolean;
  is_installing: boolean;
  is_transferring: boolean;
  relationships?: {
    allocations?: RawAllocationList;
    variable?: RawEggVariableList;
    egg?: RawEgg;
    subusers?: RawServerSubUserList;
  };
}
