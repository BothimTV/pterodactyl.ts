import { ServerStatus } from "../base/serverStatus";
import { RawAllocationList } from "./allocation";
import { RawEgg } from "./egg";
import { RawEggVariableList } from "./eggVariable";
import { RawServerSubuserList } from "./serverSubuser";

export interface RawServerList {
  object: "list";
  data: Array<RawServer>;
}

export interface RawServer {
  object: "server";
  attributes: ServerAttributes;
}

export interface ServerAttributes {
  readonly server_owner: boolean;
  readonly identifier: string;
  readonly internal_id: number | string;
  readonly uuid: string;
  name: string;
  readonly node: string;
  readonly is_node_under_maintenance: boolean;
  readonly sftp_details: {
    readonly ip: string;
    readonly port: 2022 | number;
  };
  description: string;
  readonly limits: {
    readonly memory: number;
    readonly swap: number;
    readonly disk: number;
    readonly io: number;
    readonly cpu: number;
    readonly threads?: null | string;
    readonly oom_disabled: boolean;
  };
  readonly invocation: string;
  docker_image: string;
  readonly egg_features: Array<string>;
  readonly feature_limits: {
    readonly databases: number;
    readonly allocations: number;
    readonly backups: number;
  };
  status: null | ServerStatus;
  readonly is_suspended: boolean;
  readonly is_installing: boolean;
  readonly is_transferring: boolean;
  readonly relationships?: {
    readonly allocations?: RawAllocationList;
    readonly variable?: RawEggVariableList;
    readonly egg?: RawEgg;
    readonly subusers?: RawServerSubuserList;
  };
}
