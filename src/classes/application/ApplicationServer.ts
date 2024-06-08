import { CreateDatabase, FullDatabaseList, Server, ServerDatabase as ServerDb } from "../../types/ApplicationApiResponse";
import { ServerDatabaseCreateProperties, ServerUpdateBuildProperties, ServerUpdateProperties, ServerUpdateStartupProperties } from "../../types/RequestBodies";
import { ApplicationClient } from "./ApplicationClient";
import { ServerDatabase } from "./ServerDatabase";

export class ApplicationServer {

    private readonly client: ApplicationClient
    public id: number;
    public external_id: string;
    public uuid: string;
    public identifier: string;
    public name: string;
    public description: string;
    public suspended: boolean;
    public limits: {
        memory: number;
        swap: number;
        disk: number;
        io: number;
        cpu: number;
        threads: null;
    };
    public feature_limits: {
        databases: number;
        allocations: number;
        backups: number;
    };
    public user: number;
    public node: number;
    public allocation: number;
    public nest: number;
    public egg: number;
    public pack: null;
    public container: {
        startup_command: string;
        image: string;
        installed: true;
        environment: any;
    };
    public updated_at: Date
    public created_at: Date;

    constructor(client: ApplicationClient, serverProperties: Server) {
        this.client = client;
        this.id = serverProperties.attributes.id;
        this.external_id = serverProperties.attributes.external_id;
        this.uuid = serverProperties.attributes.uuid;
        this.identifier = serverProperties.attributes.identifier;
        this.name = serverProperties.attributes.name;
        this.description = serverProperties.attributes.description;
        this.suspended = serverProperties.attributes.suspended;
        this.limits = serverProperties.attributes.limits;
        this.feature_limits = serverProperties.attributes.feature_limits;
        this.user = serverProperties.attributes.user;
        this.node = serverProperties.attributes.node;
        this.allocation = serverProperties.attributes.allocation;
        this.nest = serverProperties.attributes.nest;
        this.egg = serverProperties.attributes.egg;
        this.pack = serverProperties.attributes.pack;
        this.container = serverProperties.attributes.container;
        this.updated_at = new Date(serverProperties.attributes.updated_at);
        this.created_at = new Date(serverProperties.attributes.created_at);
    }

    /**
    * Update this server
    */
    public async update(serverProperties: ServerUpdateProperties): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/details");
        const data = await this.client.axiosRequest({ url: endpoint.href, method: "PATCH", data: serverProperties }) as Server
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
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/build");
        const data = await this.client.axiosRequest({ url: endpoint.href, method: "PATCH", data: serverProperties }) as Server
        this.allocation = data.attributes.allocation
        this.limits = data.attributes.limits
        this.feature_limits = data.attributes.feature_limits
        this.updated_at = new Date(data.attributes.updated_at);
    }

    /**
     * Update this server startup details
     */
    public async updateStartup(serverProperties: ServerUpdateStartupProperties): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/startup");
        const data = await this.client.axiosRequest({ url: endpoint.href, method: "PATCH", data: serverProperties }) as Server
        this.container = data.attributes.container
        this.egg = data.attributes.egg
        this.nest = data.attributes.nest
        this.updated_at = new Date(data.attributes.updated_at);
    }

    /**
    * Suspend this server
    */
    public async suspend(): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/suspend");
        await this.client.axiosRequest({ url: endpoint.href, method: "POST" })
    }

    /**
    * Unsuspend this server
    */
    public async unsuspend(): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/unsuspend");
        await this.client.axiosRequest({ url: endpoint.href, method: "POST" })
    }

    /**
    * Reinstall this server
    */
    public async reinstall(): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/reinstall");
        await this.client.axiosRequest({ url: endpoint.href, method: "POST" })
    }

    /**
    * Delete this server
    * @param force Should the server be force-deleted
    */
    public async delete(force: boolean = false): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + force ?? "/force");
        await this.client.axiosRequest({ url: endpoint.href, method: "DELETE" })
    }

    /**
    * Get the databases for this server
    */
    public async getDatabases(): Promise<Array<ServerDatabase>> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/databases?include=password,host");
        const res = await this.client.axiosRequest({ url: endpoint.href }) as FullDatabaseList
        return res.data.map(db => new ServerDatabase(this.client, db))
    }

    /**
    * Get a database for this server
    */
    public async getDatabase(databaseId: number): Promise<ServerDatabase> {
        const endpoint = new URL(this.client.panel + "/api/application/servers/" + this.id + "/databases/" + databaseId + "?include=password,host");
        return new ServerDatabase(this.client, await this.client.axiosRequest({ url: endpoint.href }) as ServerDb)
    }

    /**
    * Create a database for this server
    */
    public async createDatabase(databaseCreateProperties: ServerDatabaseCreateProperties): Promise<void> {
      const endpoint = new URL(this.client.panel + "/api/application/endpoint");
      await this.client.axiosRequest({ url: endpoint.href, data: databaseCreateProperties, method: "POST" })
    }

}