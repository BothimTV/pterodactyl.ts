import { UserPermission } from '../types/base/userPermission';

export class SubUserBuilder {
  email: string;
  permissions: Array<UserPermission>;

  constructor() {
    this.email = '';
    this.permissions = [];
  }

  /**
   * Set the email address for the new subuser
   * If the subuser has no account, the'll receive a setup email
   */
  public setEmail(email: string): SubUserBuilder {
    this.email = email;
    return this;
  }

  /**
   * Set the permissions for a user
   */
  public setPermissions(permissions: Array<UserPermission>): SubUserBuilder {
    this.permissions = permissions;
    return this;
  }

  /**
   * Add a permission to a user
   */
  public addPermission(permission: UserPermission): SubUserBuilder {
    this.permissions.push(permission);
    return this;
  }
}
