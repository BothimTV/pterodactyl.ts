import { ApiKeyBuilder } from "../builder/ApiKeyBuilder";
import { RawApiKey, RawApiKeyList } from "../types/user/apiKey";
import { RawRecoveryTokens, RecoveryTokensAttributes } from "../types/user/recoveryTokens";
import { RawUser, UserAttributes } from "../types/user/user";
import { RawUserMfa } from "../types/user/userMfa";
import { ApiKey } from "./ApiKey";
import { UserClient } from "./UserClient";

let client: UserClient
export class User implements UserAttributes {
    readonly id: number;
    readonly admin: boolean;
    readonly username: string;
    email: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly language: string;

    constructor(userClient: UserClient, userProps: RawUser) {
        client = userClient;
        this.id = userProps.attributes.id;
        this.admin = userProps.attributes.admin;
        this.username = userProps.attributes.username;
        this.email = userProps.attributes.email;
        this.first_name = userProps.attributes.first_name;
        this.last_name = userProps.attributes.last_name;
        this.language = userProps.attributes.language;
    }

    /**
     * Get the users mfa/2fa credentials to generate the auth codes
     */
    public async getMfaCredentials(): Promise<{ image_url_data: string, secret: string }> {
        const endpoint = new URL(client.panel + "/api/client/account/two-factor");
        const res = await client.api({ url: endpoint.href }) as RawUserMfa
        return res.data
    }

    /**
     * Enable the mfa/2fa for this account
     * @param code The 6 digit code generated from the mfs secret (via 'getMfaCredentials()')
     * @param password The account password
     * @throws Invalid code error
     */
    public async enableMfa(code: number, password: string): Promise<RecoveryTokensAttributes> {
        const endpoint = new URL(client.panel + "/api/client/account/two-factor");
        const res = await client.api({ url: endpoint.href, method: "POST", data: { code: code, password: password } }, [{ code: 400, message: "Invalid code" }]) as RawRecoveryTokens
        return res.attributes
    }

    /**
     * Disable the mfs/2fa for this account
     * @param password The account password
     * @throws Invalid password error
     */
    public async disableMfa(password: string): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/account/two-factor");
        await client.api({ url: endpoint.href, method: "DELETE", data: { password: password } }, [{ code: 400, message: "Invalid password" }])
    }

    /**
     * Update this accounts email address
     * @param email A valid new email address
     * @param password The account password
     * @throws Invalid email and/or password error
     */
    public async updateEmail(email: string, password: string): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/account/email");
        await client.api({ url: endpoint.href, method: "PUT", data: { email: email, password: password } }, [{ code: 400, message: "Invalid email and/or password" }])
    }

    /**
     * Updates this accounts password
     * @param oldPassword The old password for this account
     */
    public async updatePassword(oldPassword: string, newPassword: string, repeatPassword?: string): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/account/email");
        await client.api({ url: endpoint.href, method: "PUT", data: { 
            current_password: oldPassword, 
            password: newPassword,
            password_confirmation: repeatPassword ?? newPassword
        } })
    }

    /**
     * Get the api keys for this account
     */
    public async getApiKeys(): Promise<Array<ApiKey>> {
        const endpoint = new URL(client.panel + "/api/client/account/api-keys");
        return (await client.api({ url: endpoint.href }) as RawApiKeyList).data.map(key => new ApiKey(client, key))
    }

    /**
     * Create a new api key for this account
     */
    public async createApiKey(builder: ApiKeyBuilder): Promise<ApiKey> {
        const endpoint = new URL(client.panel + "/api/client/account/api-keys");
        return new ApiKey(client, (await client.api({ url: endpoint.href, method: "POST", data: builder }) as RawApiKey))
    }

}