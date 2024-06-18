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
  uuid: string;
  username: string;
  email: string;
  image: string;
  "2fa_enabled": boolean;
  created_at: string | Date;
  permissions: Array<UserPermission>;
}
