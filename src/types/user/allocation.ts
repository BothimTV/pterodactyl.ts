export interface RawAllocationList {
  object: "list";
  data: Array<RawAllocation>;
}

export interface RawAllocation {
  object: "allocation";
  attributes: AllocationAttributes;
}

export interface AllocationAttributes {
  readonly id: number;
  readonly ip: string;
  readonly ip_alias?: string;
  readonly port: number;
  notes?: null | string;
  is_default: boolean;
}
