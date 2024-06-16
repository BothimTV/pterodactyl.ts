import { RawPanelEggList } from "./panelEgg";
import { RawServerList } from "./server";

export interface RawPanelNestList {
  object: "list";
  data: Array<RawPanelNest>;
}

export interface RawPanelNest {
  object: "nest";
  attributes: PanelNestAttributes;
}

export interface PanelNestAttributes {
  readonly id: number;
  readonly uuid: string;
  readonly author: string;
  name: string;
  description?: null | string;
  readonly created_at: string;
  updated_at: string;
  readonly relationships?: {
    readonly eggs?: RawPanelEggList;
    readonly servers?: RawServerList;
  };
}
