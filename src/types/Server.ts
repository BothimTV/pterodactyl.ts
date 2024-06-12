import { RawServerDatabaseList } from "./Database";
import { RawLocation } from "./Location";
import { RawNodeAllocationList } from "./NodeAllocation";
import { RawPanelEgg } from "./PanelEgg";
import { RawPanelNest } from "./PanelNest";
import { RawPanelNode } from "./PanelNode";
import { RawPanelUser } from "./PanelUser";
import { RawServerSubUserList } from "./ServerSubUser";
import { RawServerVariableList } from "./ServerVariable";

export interface RawServerList {
  object: "list";
  data: Array<RawServer>;
}

export interface RawServer {
  object: "server";
  attributes: ServerAttributes;
}

export interface ServerAttributes {
  readonly id: number;
  external_id?: string | null;
  readonly uuid: string;
  identifier: string;
  name: string;
  description: string;
  status: null; // FIXME: Set to an actual status
  suspended: boolean;
  limits: {
    memory: 0 | number;
    swap: 0 | number;
    disk: 0 | number;
    io: 500 | number;
    cpu: 0 | number;
    threads: null | string;
    oom_disabled: true | boolean;
  };
  feature_limits: {
    databases: 0 | number;
    allocations: 0 | number;
    backups: 0 | number;
  };
  user: number;
  node: number;
  allocation: number;
  readonly nest: number;
  readonly egg: number;
  container: {
    startup_command: string;
    image: string;
    readonly installed: 1 | 0;
    environment: { [key: string]: string | number | boolean | null };
  };
  updated_at: string;
  readonly created_at: string;
  readonly relationships?: {
    readonly allocations?: RawNodeAllocationList;
    readonly user?: RawPanelUser;
    readonly subusers?: RawServerSubUserList;
    readonly nest?: RawPanelNest;
    readonly egg?: RawPanelEgg;
    readonly variables?: RawServerVariableList;
    readonly location?: RawLocation;
    readonly node?: RawPanelNode;
    readonly databases?: RawServerDatabaseList;
  };
}
