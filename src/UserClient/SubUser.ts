import { UserPermission } from "../types/base/userPermission";
import { RawServerSubuser, ServerSubuserAttributes } from "../types/user/serverSubuser";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient
export class SubUser implements ServerSubuserAttributes {
    readonly uuid: string;
    readonly username: string;
    readonly email: string;
    readonly image: string;
    readonly "2fa_enabled": boolean;
    readonly created_at: Date;
    permissions: Array<UserPermission>;
    readonly parentServer: Server;

    constructor(userClient: UserClient, subuserProps: RawServerSubuser, parentServer: Server) {
        client = userClient
        this.uuid = subuserProps.attributes.uuid
        this.username = subuserProps.attributes.username
        this.email = subuserProps.attributes.email
        this.image = subuserProps.attributes.image
        this["2fa_enabled"] = subuserProps.attributes["2fa_enabled"]
        this.created_at = new Date(subuserProps.attributes.created_at)
        this.permissions = subuserProps.attributes.permissions
        this.parentServer = parentServer
    }

    /**
     * Updates the permissions of the subuser.
     * @param permissions The permissions to update the subuser with.
     */
    public async updatePermissions(permissions: Array<UserPermission>): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/users/" + this.uuid);
        await client.api({ url: endpoint.href, method: "POST", data: { permissions: permissions } }) as RawServerSubuser
    }

    public async delete(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/users/" + this.uuid);
        await client.api({ url: endpoint.href, method: "DELETE" })
    }

}