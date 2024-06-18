import { ServerDatabaseBuilder } from "../builder/ServerDatabaseBuilder";
import { RawServerDatabase, RawServerDatabaseList } from "../types/application/database";
import { RawLocation } from "../types/application/location";
import { RawNodeAllocationList } from "../types/application/nodeAllocation";
import { RawPanelEgg } from "../types/application/panelEgg";
import { RawPanelNest } from "../types/application/panelNest";
import { RawPanelNode } from "../types/application/panelNode";
import { RawServer, ServerAttributes } from "../types/application/server";
import { ServerStatus } from "../types/application/serverStatus";
import { RawServerSubUserList } from "../types/application/serverSubUser";
import { RawServerVariableList } from "../types/application/serverVariable";
import { RawUser } from "../types/application/user";
import { ApplicationClient } from "./ApplicationClient";
import { Egg } from "./Egg";
import { Nest } from "./Nest";
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
    public nest: number;
    public egg: number;
    public eggData?: RawPanelEgg
    public container: {
        startup_command: string;
        image: string;
        installed: 0 | 1;
        environment: { [key: string]: string | number | boolean | null };
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
        this.updateEggData()
    }

    private async updateEggData() {
        this.eggData = await client.api({ url: client.panel + "/nests/" + this.nest + "/eggs/" + this.egg + "?include=nest,servers,variables", method: "GET" }) as RawPanelEgg
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
    public async setCpuPinning(pinning: Array<string | number> | string): Promise<void> {
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

    private async updateStartup() {
        if (!this.eggData) throw new Error("Egg data not found")
        return {
            startup: this.container.startup_command,
            nest_id: this.nest,
            egg_id: this.egg,
            skip_scripts: 0,
            docker_image: this.eggData.attributes.docker_image,
            custom_docker_image: this.container.image == this.eggData.attributes.docker_image ? undefined : this.container.image,
            environment: this.container.environment ? this.container.environment : {}
        }
    }

    private async updateThisStartup(server: RawServer) {
        this.container.startup_command = server.attributes.container.startup_command
        this.nest = server.attributes.nest
        this.egg = server.attributes.egg
        this.container.image = server.attributes.container.image
        this.updated_at = new Date(server.attributes.updated_at)
        this.container.environment = server.attributes.container.environment
        if (this.egg != server.attributes.egg || this.nest != server.attributes.nest) {
            await this.updateEggData()
        }
    }

    /**
    * Set the startup command with which the server will start  
    * This can include environment vars via {{ VAR_NAME }}
    * @default startup This will use the default startup command if you set the egg via .setEgg(egg: PanelEgg)
    */
    public async setStartupCommand(startup: string) {
        var data = await this.updateStartup()
        data.startup = startup
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the new nest for this server
     * @param nest The new nest for this server
     * @param egg The new egg for this server
     */
    public async setNestAndEgg(nest: number | Nest, egg: number | Egg): Promise<void>  {
        var data = await this.updateStartup()
        data.nest_id = typeof nest == "number" ? nest : nest.id
        data.egg_id = typeof egg == "number" ? egg : egg.id
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Skip install script
     * @param skip Whether the install script should be skipped 
     */
    public async setSkipInstall(skip: boolean): Promise<void>  {
        var data = await this.updateStartup()
        data.skip_scripts = skip ? 1 : 0
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the docker image for this server  
     * @param image The new image for this container
     */
    public async setDockerImage(image: string): Promise<void>  {
        var data = await this.updateStartup()
        data.docker_image = image
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

     /**
     * Set the environment vars with which the server will start
     * @param environment Overwrites all current variables
     */
     public async setEnvironment(environment: { [environment: string]: string }): Promise<void>  {
        var data = await this.updateStartup()
        data.environment = environment
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Add environment vars with which the server will start
     * @param environment Add a variable and value to the current variables
     */
    public async addEnvironmentVariable(key: string, value: string): Promise<void>  {
        var data = await this.updateStartup()
        data.environment[key] = value
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
     * Set the custom docker image for this server  
     * @param image The new image for this container
     */
    public async setCustomDockerImage(image: string): Promise<void>  {
        var data = await this.updateStartup()
        data.custom_docker_image = image
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/startup");
        await this.updateThisStartup(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawServer)
    }

    /**
    * Suspend this server
    */
    public async suspend(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/suspend");
        await client.api({ url: endpoint.href, method: "POST" })
        this.suspended = true
    }

    /**
    * Unsuspend this server
    */
    public async unsuspend(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/servers/" + this.id + "/unsuspend");
        await client.api({ url: endpoint.href, method: "POST" })
        this.suspended = false
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