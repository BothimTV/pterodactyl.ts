import { AllocationList, Node, NodeConfiguration } from "../../types/ApplicationApiResponse";
import { NodeAllocationBuilder } from "../builder/NodeAllocationBuilder";
import { ApplicationClient } from "./ApplicationClient";
import { NodeAllocation } from "./NodeAllocation";
import { PanelLocation } from "./PanelLocation";

var client: ApplicationClient;
export class PanelNode {

    public readonly id: number;
    public readonly uuid: string;
    public public: boolean;
    public name: string;
    public description?: string;
    public location_id: number;
    public fqdn: string;
    public scheme: "http" | "https";
    public behind_proxy: boolean;
    public maintenance_mode: boolean;
    public memory: number;
    public memory_overallocate: number;
    public disk: number;
    public disk_overallocate: number;
    public upload_size: 100 | number;
    public daemon_listen: 8080 | number;
    public daemon_sftp: 2022 | number;
    public daemon_base: string;
    public readonly created_at: Date;
    public updated_at: Date;
    public readonly allocated_resources: {
        memory: number;
        disk: number;
    }
    public nodeConfiguration?: NodeConfiguration;
    public allocations?: Array<NodeAllocation>

    constructor(applicationClient: ApplicationClient, nodeProps: Node) {
        client = applicationClient;
        this.id = nodeProps.attributes.id;
        this.uuid = nodeProps.attributes.uuid;
        this.public = nodeProps.attributes.public;
        this.name = nodeProps.attributes.name;
        this.description = nodeProps.attributes.description;
        this.location_id = nodeProps.attributes.location_id;
        this.fqdn = nodeProps.attributes.fqdn;
        this.scheme = nodeProps.attributes.scheme;
        this.behind_proxy = nodeProps.attributes.behind_proxy;
        this.maintenance_mode = nodeProps.attributes.maintenance_mode;
        this.memory = nodeProps.attributes.memory;
        this.memory_overallocate = nodeProps.attributes.memory_overallocate;
        this.disk = nodeProps.attributes.disk;
        this.disk_overallocate = nodeProps.attributes.disk_overallocate;
        this.upload_size = nodeProps.attributes.upload_size;
        this.daemon_listen = nodeProps.attributes.daemon_listen;
        this.daemon_sftp = nodeProps.attributes.daemon_sftp;
        this.daemon_base = nodeProps.attributes.daemon_base;
        this.created_at = new Date(nodeProps.attributes.created_at);
        this.updated_at = new Date(nodeProps.attributes.updated_at);
        this.allocated_resources = {
            memory: nodeProps.attributes.allocated_resources.memory,
            disk: nodeProps.attributes.allocated_resources.disk
        }
    }

    /**
    * Get the config of this node
    */
    public async getConfiguration(): Promise<NodeConfiguration> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id + "/configuration");
        this.nodeConfiguration = await client.axiosRequest({ url: endpoint.href }) as NodeConfiguration
        return this.nodeConfiguration
    }

    private updateProps() {
        return {
            name: this.name,
            description: this.description,
            location_id: this.location_id,
            public: this.public ? 1 : 0, // (0 = false, 1 = true)
            fqdn: this.fqdn,
            scheme: this.scheme,
            behind_proxy: this.behind_proxy ? 1 : 0, // (0 = false, 1 = true)
            maintenance_mode: this.maintenance_mode ? 1 : 0, // (0 = off; 1 = on)
            memory: this.memory,
            memory_overallocate: this.memory_overallocate,
            disk: this.disk,
            disk_overallocate: this.disk_overallocate,
            upload_size: this.upload_size,
            daemon_listen: this.daemon_listen,
            daemon_sftp: this.daemon_sftp,
            reset_secret: ""
        }
    }

    private updateThisNode(node: Node | null) {
        if (!node) {
            return console.error("There was an error whilst updating this node, you'll have to set the configuration manually!")
        }
        this.name = node.attributes.name
        this.description = node.attributes.description
        this.location_id = node.attributes.location_id
        this.public = node.attributes.public
        this.fqdn = node.attributes.fqdn
        this.scheme = node.attributes.scheme
        this.behind_proxy = node.attributes.behind_proxy
        this.maintenance_mode = node.attributes.maintenance_mode
        this.memory = node.attributes.memory
        this.memory_overallocate = node.attributes.memory_overallocate
        this.disk = node.attributes.disk
        this.disk_overallocate = node.attributes.disk_overallocate
        this.upload_size = node.attributes.upload_size
        this.daemon_listen = node.attributes.daemon_listen
        this.daemon_sftp = node.attributes.daemon_sftp
        this.updated_at = new Date(node.attributes.updated_at)
    }

    /**
     * Update this nodes name
     * @param name The new name of this node
     */
    public async setName(name: string): Promise<void> {
        var data = this.updateProps();
        data.name = name;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes description
     * @param description The new description of this node
     */
    public async setDescription(description: string): Promise<void> {
        var data = this.updateProps();
        data.description = description;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update the location for this nodes 
     * @param location The new location of this node
     */
    public async setLocation(location: PanelLocation | number): Promise<void> {
        var data = this.updateProps();
        data.location_id = typeof location === "number" ? location : location.id;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update weather this node is public or not
     * @param isPublic Should this node be public
     */
    public async setPublic(isPublic: boolean): Promise<void> {
        var data = this.updateProps();
        data.public = isPublic ? 1 : 0;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes fqdn
     * @param fqdn The new fqdn of this node
     */
    public async setFqdn(fqdn: string): Promise<void> {
        var data = this.updateProps();
        data.fqdn = fqdn;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes scheme
     * @param scheme The new scheme of this node
     */
    public async setScheme(scheme: "http" | "https"): Promise<void> {
        var data = this.updateProps();
        data.scheme = scheme;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update weather this node is behind a proxy or not
     * @param behindProxy Is this node behind a proxy
     */
    public async setBehindProxy(behindProxy: boolean): Promise<void> {
        var data = this.updateProps();
        data.behind_proxy = behindProxy ? 1 : 0;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes maintenance state
     * @param maintenanceActive Should this node be in maintenance mode
     */
    public async setMaintenance(maintenanceActive: boolean): Promise<void> {
        var data = this.updateProps();
        data.maintenance_mode = maintenanceActive ? 1 : 0;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes memory 
     * @param memory The new memory limit of this node (in MiB)
     */
    public async setMemory(memory: number): Promise<void> {
        var data = this.updateProps();
        data.memory = memory;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Set the memory overallocate for this node  
     * Use -1 to disable overallocation check  
     * Use 0 to prevent new servers if memory limit is reached
     * @param overAllocation in %
     */
    public async setMemoryOverAllocation(overAllocation: -1 | 0 | number): Promise<void> {
        var data = this.updateProps();
        data.memory_overallocate = overAllocation;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes disk 
     * @param disk The new disk limit of this node (in MiB)
     */
    public async setDisk(disk: number): Promise<void> {
        var data = this.updateProps();
        data.disk = disk;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Set the disk overallocate for this node  
     * Use -1 to disable overallocation check  
     * Use 0 to prevent new servers if disk limit is reached
     * @param overAllocation in %
     */
    public async setDiskOverAllocation(overAllocation: -1 | 0 | number): Promise<void> {
        var data = this.updateProps();
        data.disk_overallocate = overAllocation;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Update this nodes upload size limit  
     * [Cloudflare allows 100 MiB on the free tier]
     * @param limit The new upload size limit of this node (in MiB)
     */
    public async setUploadSizeLimit(limit: 100 | number): Promise<void> {
        var data = this.updateProps();
        data.upload_size = limit;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Set the daemon port for this node
     *   
     * -----------------------------  
     * If you use Cloudflare with the proxy feature, you'll need to use 8443  
     * More information: https://pterodactyl.io/wings/1.0/configuration.html#enabling-cloudflare-proxy  
     * -----------------------------
     * @param port The new port for the daemon  
     * @default port 8080
     */
    public async setDaemonPort(port: number): Promise<void> {
        var data = this.updateProps();
        data.daemon_listen = port;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Set the daemon sftp port for this node  
     * DO NOT use the same port as your servers SSH port!  
     * ---------------------------------  
     * If you use Cloudflare with the proxy feature, you'll need to use the enterprise plan!  
     * More information: https://pterodactyl.io/wings/1.0/configuration.html#enabling-cloudflare-proxy  
     * ---------------------------------
     * @param port The new port for the daemon sftp
     * @default port 2022
     */
    public async setDaemonSftpPort(port: number): Promise<void> {
        var data = this.updateProps();
        data.daemon_sftp = port;
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
     * Resets the Daemon Master Key  
     * This key is used for communication between the panel and the node(s)  
     * Pterodactyl suggests to rotate this secret regularly
     */
    public async resetDaemonMasterKey(): Promise<void> {
        var data = this.updateProps();
        data.reset_secret = "on";
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        this.updateThisNode(await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: data }, undefined, ["ConfigurationNotPersistedException"]) as Node | null)
    }

    /**
    * Delete this node
    */
    public async delete(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id);
        await client.axiosRequest({ url: endpoint.href, method: "DELETE" })
    }

    /**
     * Get the allocations of this node
     */
    public async getAllocations(): Promise<Array<NodeAllocation>> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id + "/allocations");
        const data = await client.axiosRequest({ url: endpoint.href }) as AllocationList
        const res: Array<NodeAllocation> = []
        for (const allocation of data.data) {
            res.push(new NodeAllocation(client, allocation, this))
        }
        this.allocations = res
        return res
    }

    /**
    * Create a allocation for this node
    */
    public async createAllocation(allocationProperties: NodeAllocationBuilder): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id + "/allocations");
        await client.axiosRequest({ url: endpoint.href, data: allocationProperties, method: "POST" })
    }

}