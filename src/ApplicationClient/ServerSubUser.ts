import { RawServerSubUser, ServerSubUserAttributes } from '../types/application/serverSubUser';
import { UserPermission } from '../types/base/userPermission';

export class ServerSubUser implements ServerSubUserAttributes {
  id: number;
  user_id: number;
  server_id: number;
  permissions: Array<UserPermission>;
  created_at: Date;
  updated_at: Date;

  constructor(data: RawServerSubUser) {
    this.id = data.attributes.id;
    this.user_id = data.attributes.user_id;
    this.server_id = data.attributes.server_id;
    this.permissions = data.attributes.permissions;
    this.created_at = new Date(data.attributes.created_at);
    this.updated_at = new Date(data.attributes.updated_at);
  }
}
