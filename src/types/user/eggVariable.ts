export interface RawEggVariableList {
  object: "list";
  data: Array<RawEggVariable>;
  meta?: {
    startup_command: string;
    docker_images: { [key: string]: string };
    raw_startup_command: string;
  };
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
