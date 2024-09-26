export interface RawDatabasePassword {
  object: 'database_password';
  attributes: DatabasePasswordAttributes;
}

export interface DatabasePasswordAttributes {
  password: string;
}
