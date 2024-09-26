export interface RawEggVariableList {
  object: 'list';
  data: Array<RawEggVariable>;
  meta?: {
    startup_command: string;
    docker_images: { [key: string]: string };
    raw_startup_command: string;
  };
}

export interface RawEggVariable {
  object: 'egg_variable';
  attributes: EggVariableAttributes;
}

export interface EggVariableAttributes {
  readonly name: string;
  readonly description: string;
  readonly env_variable: string;
  readonly default_value: string;
  server_value: string;
  readonly is_editable: boolean;
  readonly rules: string;
}
