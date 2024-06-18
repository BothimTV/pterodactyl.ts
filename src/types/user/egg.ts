/*export interface RawEggList {
  object: "list";
  data: Array<RawEgg>;
}*/

export interface RawEgg {
  object: "egg";
  attributes: EggAttributes;
}

export interface EggAttributes {
  uuid: string;
  name: string;
}
