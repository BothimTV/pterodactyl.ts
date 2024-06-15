import { RawServer } from "../types/server";
import { RawUser, UserAttributes } from "../types/user";
import { ApplicationClient } from "./ApplicationClient";
import { Server } from "./Server";

var client: ApplicationClient;
var relationships:
  | {
      servers?: {
        object: "list";
        data: Array<RawServer>;
      };
    }
  | undefined;
export class User implements UserAttributes {
  public readonly id: number;
  public external_id?: string | null;
  public readonly uuid: string;
  public username: string;
  public email: string;
  public first_name: string;
  public last_name: string;
  public language: "en" | string;
  public root_admin: boolean;
  public readonly "2fa": boolean;
  public readonly created_at: Date;
  public updated_at: Date;
  public servers?: Array<Server>;

  constructor(applicationClient: ApplicationClient, userData: RawUser) {
    client = applicationClient;
    this.id = userData.attributes.id;
    this.external_id = userData.attributes.external_id;
    this.uuid = userData.attributes.uuid;
    this.username = userData.attributes.username;
    this.email = userData.attributes.email;
    this.first_name = userData.attributes.first_name;
    this.last_name = userData.attributes.last_name;
    this.language = userData.attributes.language;
    this.root_admin = userData.attributes.root_admin; // NOTE: Not tested - might be readonly
    this["2fa"] = userData.attributes["2fa"];
    this.created_at = new Date(userData.attributes.created_at);
    this.updated_at = new Date(userData.attributes.updated_at);
    relationships = userData.attributes.relationships;
  }

  /**
   * Delete this user from the panel
   */
  public async delete(): Promise<void> {
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    await client.api({ url: endpoint.href, method: "DELETE" });
  }

  private updateProps() {
    return {
      email: this.email,
      username: this.username,
      first_name: this.first_name,
      last_name: this.last_name,
      language: this.language,
      root_admin: this.root_admin ? 1 : 0,
      password: "",
    };
  }

  private updateThisUser(user: RawUser) {
    this.email = user.attributes.email;
    this.username = user.attributes.username;
    this.first_name = user.attributes.first_name;
    this.last_name = user.attributes.last_name;
    this.language = user.attributes.language;
    this.root_admin = user.attributes.root_admin;
    this.updated_at = new Date(user.attributes.updated_at);
  }

  /**
   * Update this user's email address on the panel
   * @param email The new email address
   */
  public async setEmail(email: string): Promise<void> {
    var data = this.updateProps();
    data.email = email;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's username on the panel
   * @param username The new username
   */
  public async setUsername(username: string): Promise<void> {
    var data = this.updateProps();
    data.username = username;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's first name on the panel
   * @param firstName The new first name
   */
  public async setFirstName(firstName: string): Promise<void> {
    var data = this.updateProps();
    data.first_name = firstName;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's last name on the panel
   * @param lastName The new last name
   */
  public async setLastName(lastName: string): Promise<void> {
    var data = this.updateProps();
    data.last_name = lastName;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's language on the panel
   * @param language The new language
   * @default language en
   */
  public async setLanguage(language: string): Promise<void> {
    var data = this.updateProps();
    data.language = language;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's password on the panel
   * @param password The new password
   */
  public async setPassword(password: string): Promise<void> {
    var data = this.updateProps();
    data.password = password;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }

  /**
   * Update this user's admin status on the panel
   * @param panelAdmin Should the user be an admin
   * @default panelAdmin false
   */
  public async setPanelAdmin(panelAdmin: boolean): Promise<void> {
    var data = this.updateProps();
    data.root_admin = panelAdmin ? 1 : 0;
    const endpoint = new URL(
      client.panel + "/api/application/users/" + this.id
    );
    this.updateThisUser(
      (await client.api({
        url: endpoint.href,
        method: "PATCH",
        data: data,
      })) as RawUser
    );
  }
}
