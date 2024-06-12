export interface RawLocationList {
  object: "list";
  data: Array<RawLocation>;
}

export interface RawLocation {
  object: "location";
  attributes: LocationAttributes;
}

export interface LocationAttributes {
  readonly id: number;
  short: string;
  long?: null | string;
  updated_at: string;
  readonly created_at: string;
}
