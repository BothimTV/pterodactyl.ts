import { ServerDatabaseCreateProperties, ServerUpdateBuildProperties, ServerUpdateProperties, ServerUpdateStartupProperties } from "../../types/RequestBodies";
import { RawServerDatabase, RawServerDatabaseList } from "../types/database";
import { RawLocation } from "../types/location";
import { RawNodeAllocationList } from "../types/nodeAllocation";
import { RawPanelEgg } from "../types/panelEgg";
import { RawPanelNest } from "../types/panelNest";
import { RawPanelNode } from "../types/panelNode";
import { RawPanelUser } from "../types/panelUser";
import { RawServer, ServerAttributes } from "../types/server";
import { ServerStatus } from "../types/serverStatus";
import { RawServerSubUserList } from "../types/serverSubUser";
import { RawServerVariableList } from "../types/serverVariable";
import { ApplicationClient } from "./ApplicationClient";
import { ServerDatabase } from "./ServerDatabase";

var client: ApplicationClient
export class Server implements ServerAttributes {

    public readonly id: number;
    public external_id?: null | string;
    public readonly uuid: string;
    public identifier: string;
    public name: string;
    public description: string;
    public status: ServerStatus;
    public suspended: boolean;
    public limits: {
        memory: number;
        swap: number;
        disk: number;
        io: number;
        cpu: number;
        threads: null | string;
        oom_disabled: boolean
    };
    public feature_limits: {
        databases: number;
        allocations: number;
        backups: number;
    };
    public user: number;
    public node: number;
    public allocation: number;
    public readonly nest: number;
    public readonly egg: number;
    public container: {
        startup_command: string;
        image: string;
        installed: 0 | 1;
        environment: any;
    };
    public updated_at: Date
    public readonly created_at: Date;
    readonly relationships?: {
        readonly allocations?: RawNodeAllocationList;
        readonly user?: RawPanelUser;
        readonly subusers?: RawServerSubUserList;
        readonly nest?: RawPanelNest;
        readonly egg?: RawPanelEgg;
        readonly variables?: RawServerVariableList;
        readonly location?: RawLocation;
        readonly node?: RawPanelNode;
        readonly databases?: RawServerDatabaseList;
    };

    constructor(applicationClient: ApplicationClient, serverProperties: RawServer) {
        client = applicationClient;
        this.id = serverProperties.attributes.id;
        this.external_id = serverProperties.attributes.external_id;
        this.uuid = serverProperties.attributes.uuid;
        this.identifier = serverProperties.attributes.identifier;
        this.name = serverProperties.attributes.name;
        this.description = serverProperties.attributes.description;
        this.status = serverProperties.attributes.status;
        this.suspended = serverProperties.attributes.suspended;
        this.limits = serverProperties.attributes.limits;
        this.feature_limits = serverProperties.attributes.feature_limits;
        this.user = serverProperties.attributes.user;
        this.node = serverProperties.attributes.node;
        this.allocation = serverProperties.attributes.allocation;
        this.nest = serverProperties.attributes.nest;
        this.egg = serverProperties.attributes.egg;
        this.container = serverProperties.attributes.container;
        this.updated_at = new Date(serverProperties.attributes.updated_at);
        this.created_at = new Date(serverProperties.attributes.created_at);
    }

    /**
    * Update this server
    * FIXME: @deprecated
    */
    public async update(serverProperties: ServerUpdateProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/details");
        const data = await client.api({ url: endpoint.href, method: "PATCH", data: serverProperties }) as RawServer
        this.name = data.attributes.name;
        this.user = data.attributes.user;
        this.external_id = data.attributes.external_id;
        this.description = data.attributes.description;
        this.updated_at = new Date(data.attributes.updated_at);
    }

    /**
    * Update this server build details
    */
    public async updateBuild(serverProperties: ServerUpdateBuildProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        const data = await client.api({ url: endpoint.href, method: "PATCH", data: serverProperties }) as RawServer
        this.allocation = data.attributes.allocation
        this.limits = data.attributes.limits
        this.feature_limits = data.attributes.feature_limits
        this.updated_at = new Date(data.attributes.updated_at);
    }

    /**
     * Update this server startup details
     */
    public async updateStartup(serverProperties: ServerUpdateStartupProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        const data = await client.api({ url: endpoint.href, method: "PATCH", data: serverProperties }) as RawServer
        this.container = data.attributes.container
        this.egg = data.attributes.egg
        this.nest = data.attributes.nest
        this.updated_at = new Date(data.attributes.updated_at);
    }

    /**
    * Suspend this server
    */
    public async suspend(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/suspend");
        await client.api({ url: endpoint.href, method: "POST" })
    }

    /**
    * Unsuspend this server
    */
    public async unsuspend(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/unsuspend");
        await client.api({ url: endpoint.href, method: "POST" })
    }

    /**
    * Reinstall this server
    */
    public async reinstall(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/reinstall");
        await client.api({ url: endpoint.href, method: "POST" })
    }

    /**
    * Delete this server
    * @param force Should the server be force-deleted
    */
    public async delete(force: boolean = false): Promise<void> {
        // deepcode ignore AmbiguousConditional
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + force ? "/force" : "/");
        await client.api({ url: endpoint.href, method: "DELETE" })
    }

    /**
    * Get the databases for this server
    */
    public async getDatabases(): Promise<Array<ServerDatabase>> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/databases?include=password,host");
        const res = await client.api({ url: endpoint.href }) as RawServerDatabaseList
        return res.data.map(db => new ServerDatabase(client, db))
    }

    /**
    * Get a database for this server
    */
    public async getDatabase(databaseId: number): Promise<ServerDatabase> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/databases/" + databaseId + "?include=password,host");
        return new ServerDatabase(client, await client.api({ url: endpoint.href }) as RawServerDatabase)
    }

    /**
    * Create a database for this server
    */
    public async createDatabase(databaseCreateProperties: ServerDatabaseCreateProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/endpoint");
        await client.api({ url: endpoint.href, data: databaseCreateProperties, method: "POST" })
    }

}