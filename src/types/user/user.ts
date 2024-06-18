export interface RawUser {
  object: "user";
  attributes: UserAttributes;
}

export interface UserAttributes {
  readonly id: number;
  readonly admin: boolean;
  readonly username: string;
  email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly language: "en" | string;
}
