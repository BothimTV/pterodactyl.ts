export interface RawUser {
  object: "user";
  attributes: UserAttributes;
}

export interface UserAttributes {
  id: number;
  admin: boolean;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: "en" | string;
}
