import { RawServerList } from "./server";

export interface RawUserList {
  object: "list";
  data: Array<RawUser>;
}

export interface RawUser {
  object: "user";
  attributes: UserAttributes;
}

export interface UserAttributes {
  readonly id: number;
  external_id?: string | null;
  readonly uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: "en" | string;
  root_admin: boolean;
  readonly "2fa": boolean;
  readonly created_at: string | Date;
  updated_at: string | Date;
  readonly relationships?: {
    readonly servers?: RawServerList;
  };
}
