import { RawServerVariable, ServerVariableAttributes } from '../types/application/serverVariable';

export class ServerVariable implements ServerVariableAttributes {
  readonly id: number;
  readonly egg_id: number;
  readonly name: string;
  readonly description?: number | undefined;
  readonly env_variable: string;
  readonly default_value: string;
  readonly user_viewable: boolean;
  readonly user_editable: boolean;
  readonly rules: string;
  readonly created_at: string | Date;
  updated_at: string | Date;
  server_value: string;

  constructor(variableProps: RawServerVariable) {
    this.id = variableProps.attributes.id;
    this.egg_id = variableProps.attributes.egg_id;
    this.name = variableProps.attributes.name;
    this.description = variableProps.attributes.description;
    this.env_variable = variableProps.attributes.env_variable;
    this.default_value = variableProps.attributes.default_value;
    this.user_viewable = variableProps.attributes.user_viewable;
    this.user_editable = variableProps.attributes.user_editable;
    this.rules = variableProps.attributes.rules;
    this.created_at = new Date(variableProps.attributes.created_at);
    this.updated_at = new Date(variableProps.attributes.updated_at);
    this.server_value = variableProps.attributes.server_value;
  }
}
