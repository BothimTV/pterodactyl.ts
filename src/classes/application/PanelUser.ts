import { User } from "../../types/ApplicationApiResponse";
import { UserUpdateProperties } from "../../types/RequestBodies";
import { ApplicationClient } from "./ApplicationClient";

export class PanelUser {
    private readonly client: ApplicationClient
    public readonly id: number;
    public external_id: null | string;
    public readonly uuid: string;
    public username: string;
    public email: string;
    public first_name: string;
    public last_name: string;
    public language: "en" | string;
    public root_admin: boolean;
    public readonly mfa: boolean;
    public readonly created_at: Date;
    public updated_at: Date; 

    constructor(client: ApplicationClient, userData: User) {
        this.client = client;
        this.id = userData.attributes.id;
        this.external_id = userData.attributes.external_id;
        this.uuid = userData.attributes.uuid;
        this.username = userData.attributes.username;
        this.email = userData.attributes.email;
        this.first_name = userData.attributes.first_name;
        this.last_name = userData.attributes.last_name;
        this.language = userData.attributes.language;
        this.root_admin = userData.attributes.root_admin; // NOTE: Not tested - might be readonly
        this.mfa = userData.attributes["2fa"];
        this.created_at = new Date(userData.attributes.created_at);
        this.updated_at = new Date(userData.attributes.updated_at);
    }

        
    /**
     * Delete this user from the panel
     */
    public async delete(): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/users/" + this.id);
        await this.client.axiosRequest({ url: endpoint.href, method: "DELETE" });
    }

    /**
     * Update this user on the panel
     * @param userProperties The new properties of the user
     */
    public async update(userProperties: UserUpdateProperties): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/users/" + this.id);
        const newData = await this.client.axiosRequest({ url: endpoint.href, method: "PATCH", data: userProperties }) as User
        this.external_id = newData.attributes.external_id; // NOTE: Not tested - might change

        this.username = newData.attributes.username;
        this.email = newData.attributes.email;
        this.first_name = newData.attributes.first_name;
        this.last_name = newData.attributes.last_name;
        this.language = newData.attributes.language;
        this.root_admin = newData.attributes.root_admin; // NOTE: Not tested - might change
        this.updated_at = new Date(newData.attributes.updated_at);
    }


}