export interface RawAllocationList {
  object: "list";
  data: Array<RawAllocation>;
}

export interface RawAllocation {
  object: "allocation";
  attributes: AllocationAttributes;
}

export interface AllocationAttributes {
  id: number;
  ip: string;
  ip_alias?: string;
  port: number;
  notes: null | string;
  is_default: boolean;
}
