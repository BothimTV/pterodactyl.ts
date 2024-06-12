import { RawLocation } from "./Location";
import { RawNodeAllocationList } from "./NodeAllocation";
import { RawServerList } from "./Server";

export interface RawPanelNodeList {
  object: "list";
  data: Array<RawPanelNode>;
}

export interface RawPanelNode {
  object: "node";
  attributes: PanelNodeAttributes;
}

export interface PanelNodeAttributes {
  readonly id: number;
  readonly uuid: string;
  public: boolean;
  name: string;
  description?: null | string;
  readonly location_id: number;
  fqdn: string;
  scheme: "http" | "https";
  behind_proxy: false;
  maintenance_mode: false;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: 100 | number;
  daemon_listen: 8080 | number;
  daemon_sftp: 2022 | number;
  daemon_base: "/var/lib/pterodactyl/volumes" | string;
  readonly created_at: string;
  updated_at: string;
  allocated_resources: {
    memory: number;
    disk: number;
  };
  readonly relationships: {
    readonly allocations?: RawNodeAllocationList;
    readonly location?: RawLocation;
    readonly servers?: RawServerList;
  };
}
