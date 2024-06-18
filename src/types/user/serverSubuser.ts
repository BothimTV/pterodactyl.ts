import { UserPermission } from "../base/userPermission";

export interface RawServerSubuserList {
  object: "list";
  data: Array<RawServerSubuser>;
}

export interface RawServerSubuser {
  object: "server_subuser";
  attributes: ServerSubuserAttributes;
}

export interface ServerSubuserAttributes {
  readonly uuid: string;
  readonly username: string;
  readonly email: string;
  readonly image: string;
  readonly "2fa_enabled": boolean;
  readonly created_at: string | Date;
  permissions: Array<UserPermission>;
}
