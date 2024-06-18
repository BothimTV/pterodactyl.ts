export interface RawEggVariableList {
  object: "list";
  data: Array<RawEggVariable>;
}

export interface RawEggVariable {
  object: "egg_variable";
  attributes: EggVariableAttributes;
}

export interface EggVariableAttributes {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  server_value: string;
  is_editable: boolean;
  rules: string;
}
