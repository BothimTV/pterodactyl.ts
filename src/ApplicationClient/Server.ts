import { ServerUpdateStartupProperties } from "../../types/RequestBodies";
import { ServerDatabaseBuilder } from "../builder/ServerDatabaseBuilder";
import { RawServerDatabase, RawServerDatabaseList } from "../types/database";
import { RawLocation } from "../types/location";
import { RawNodeAllocationList } from "../types/nodeAllocation";
import { RawPanelEgg } from "../types/panelEgg";
import { RawPanelNest } from "../types/panelNest";
import { RawPanelNode } from "../types/panelNode";
import { RawServer, ServerAttributes } from "../types/server";
import { ServerStatus } from "../types/serverStatus";
import { RawServerSubUserList } from "../types/serverSubUser";
import { RawServerVariableList } from "../types/serverVariable";
import { RawUser } from "../types/user";
import { ApplicationClient } from "./ApplicationClient";
import { NodeAllocation } from "./NodeAllocation";
import { ServerDatabase } from "./ServerDatabase";
import { User } from "./User";

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
        readonly user?: RawUser;
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

    private updateProps() {
        return {
            name: this.name,
            external_id: this.external_id,
            owner_id: this.user,
            description: this.description
        }
    }

    private updateThisProps(server: RawServer) {
        this.name = server.attributes.name;
        this.user = server.attributes.user;
        this.external_id = server.attributes.external_id;
        this.description = server.attributes.description;
        this.updated_at = new Date(server.attributes.updated_at);
    }

    /**
     * Set the name for this server
     * @param name The new name for this server
     */
    public async setName(name: string): Promise<void> {
        var data = this.updateProps()
        data.name = name;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/details");
        this.updateThisProps(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the external id for this server
     * @param externalId The new external id for this server
     */
    public async setExternalId(externalId: string): Promise<void> {
        var data = this.updateProps()
        data.external_id = externalId;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/details");
        this.updateThisProps(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the owner for this server
     * @param owner The ownerId or the User object
     */
    public async setOwner(owner: number | User): Promise<void> {
        var data = this.updateProps()
        data.owner_id = typeof owner === "number" ? owner : owner.id;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/details");
        this.updateThisProps(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the description for this server
     * @param description The new description for this server
     */
    public async setDescription(description: string): Promise<void> {
        var data = this.updateProps()
        data.description = description;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/details");
        this.updateThisProps(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    private updateBuild() {
        return {
            cpu: this.limits.cpu,
            threads: this.limits.threads,
            memory: this.limits.memory,
            swap: this.limits.swap,
            disk: this.limits.disk,
            io: this.limits.io,
            oom_disabled: this.limits.oom_disabled ? 1 : 0,
            database_limit: this.feature_limits.databases,
            allocation_limit: this.feature_limits.allocations,
            backup_limit: this.feature_limits.backups,
            allocation_id: this.allocation,
        }
    }

    private updateThisBuild(server: RawServer) {
        this.name = server.attributes.name;
        this.user = server.attributes.user;
        this.external_id = server.attributes.external_id;
        this.description = server.attributes.description;
        this.updated_at = new Date(server.attributes.updated_at);
    }

    /**
     * Set the maximum cpu usage for this server  
     * Set this to 0 for no cpu limit  
     * ------------------------  
     * If you have 4 cores and want to allow to use all of them you'll need to use 400  
     * Example: 4 * 100 = 400 | Cores * 100 = Max for this node  
     * ------------------------  
     * @param limit The new cpu limit in %
     */
    public async setCpuLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.cpu = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set which cores can be used by a server  
     * Example: 0; 1-3; 4,5,6;
     * @param limit The new cpu limit in %
     */
    public async setCpuPinning(pinning: Array<string> | string): Promise<void> {
        var data = this.updateBuild()
        data.threads = typeof pinning === "string" ? pinning : pinning.join(",");
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new memory limit
     * @param limit The new memory limit in MiB
     */
    public async setMemoryLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.memory = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new swap limit
     * @param limit The new swap limit in MiB
     */
    public async setSwapLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.swap = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new disk limit
     * @param limit The new disk limit in MiB
     */
    public async setDiskLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.disk = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * [ADVANCED]  
     * Set the io limit for this server  
     * Documentation: https://docs.docker.com/engine/reference/run/#block-io-bandwidth-blkio-constraint  
     * @param limit The new io limit, number between 10 and 1000
     */
    public async setIoLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.io = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Enable the OOM killer  
     * This will kill the server if it exceeds the memory limit  
     * This may cause the server processes to exit unexpectedly  
     * This CAN cause to data corruption
     * @param active Should the oom killer be active
     */
    public async setOomKillerState(active: boolean): Promise<void> {
        var data = this.updateBuild()
        data.oom_disabled = active ? 0 : 1;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new database limit
     * @param limit How many databases can be created for this server
     */
    public async setDatabaseLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.database_limit = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new backup limit
     * @param limit How many backups can be created for this server
     */
    public async setBackupLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.backup_limit = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new allocation limit
     * @param limit How many allocations can be created for this server
     */
    public async setAllocationLimit(limit: number): Promise<void> {
        var data = this.updateBuild()
        data.allocation_limit = limit;
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Add a allocation to this server
     * @param allocation The allocation id or the NodeAllocation object
     */
    public async addAllocation(allocation: number | NodeAllocation): Promise<void> {
        var data = this.updateBuild() as any
        data.add_allocations[typeof allocation == "number" ? allocation : allocation.id] = typeof allocation == "number" ? allocation : allocation.id
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Remove a allocation from this server
     * @param allocation The allocation id or the NodeAllocation object
     */
    public async removeAllocation(allocation: number | NodeAllocation): Promise<void> {
        var data = this.updateBuild() as any
        data.remove_allocations[typeof allocation == "number" ? allocation : allocation.id] = typeof allocation == "number" ? allocation : allocation.id
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/build");
        this.updateThisBuild(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }
    
    /**
     * Update this server startup details
     * FIXME: @deprecated
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
    public async createDatabase(databaseCreateProperties: ServerDatabaseBuilder): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/endpoint");
        await client.api({ url: endpoint.href, data: databaseCreateProperties, method: "POST" })
    }

}