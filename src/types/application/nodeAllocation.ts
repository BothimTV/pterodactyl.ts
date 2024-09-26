import { RawPanelNode } from "./panelNode";
import { RawServer } from "./server";

export interface RawNodeAllocationList {
  object: "list";
  data: Array<RawNodeAllocation>;
}

export interface RawNodeAllocation {
  object: "allocation";
  attributes: NodeAllocationAttributes;
}

export interface NodeAllocationAttributes {
  readonly id: number;
  readonly ip: string;
  readonly alias?: null | string;
  readonly port: number;
  notes?: null | string;
  assigned: boolean;
  is_default?: boolean;
  readonly relationships?: {
    node?: RawPanelNode;
    server?: RawServer;
  };
}
