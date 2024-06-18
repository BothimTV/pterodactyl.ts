import { UserPermission } from "./userPermission";

export interface RawServerSubUserList {
  object: "list";
  data: Array<RawServerSubUser>;
}

export interface RawServerSubUser {
  object: "subuser";
  attributes: ServerSubUserAttributes;
}

export interface ServerSubUserAttributes {
    readonly id: number;
    readonly user_id: number;
    readonly server_id: number;
    permissions: Array<UserPermission>
    readonly created_at: string | Date;
    updated_at: string | Date;
}
