export interface RawServerVariableList {
  object: "list";
  data: Array<RawServerVariable>;
}

export interface RawServerVariable {
  object: "server_variable";
  attributes: ServerVariableAttributes;
}

export interface ServerVariableAttributes {
  readonly id: number;
  readonly egg_id: number;
  readonly name: string;
  readonly description?: number;
  readonly env_variable: string;
  readonly default_value: string;
  readonly user_viewable: boolean;
  readonly user_editable: boolean;
  readonly rules: string
  readonly created_at: string | Date;
  updated_at: string | Date;
  server_value: string;
}
