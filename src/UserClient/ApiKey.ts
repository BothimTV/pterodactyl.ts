import { ApiKeyAttributes, RawApiKey } from "../types/user/apiKey";
import { UserClient } from "./UserClient";

let client: UserClient
export class ApiKey implements ApiKeyAttributes {
    readonly identifier: string;
    readonly description: string;
    readonly allowed_ips: Array<string>;
    readonly last_used_at: Date;
    readonly created_at: Date;
    readonly secret?: string

    constructor(userClient: UserClient, apiKeyProps: RawApiKey) {
        client = userClient
        this.identifier = apiKeyProps.attributes.identifier
        this.description = apiKeyProps.attributes.description
        this.allowed_ips = apiKeyProps.attributes.allowed_ips
        this.last_used_at = new Date(apiKeyProps.attributes.last_used_at)
        this.created_at = new Date(apiKeyProps.attributes.created_at)
        this.secret = apiKeyProps.meta?.secret_token
    }

    /**
     * Delete this api key from this account
     * @throws Unknown api key error
     */
    public async delete(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/account/api-keys/" + this.identifier);
        await client.api({ url: endpoint.href, method: "DELETE" }, [{ code: 404, message: "Unknown apikey." }])
    }

}