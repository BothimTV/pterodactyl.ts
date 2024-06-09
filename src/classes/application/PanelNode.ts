import { AllocationList, Node, NodeConfiguration } from "../../types/ApplicationApiResponse";
import { AllocationCreateProperties, NodeUpdateProperties } from "../../types/RequestBodies";
import { ApplicationClient } from "./ApplicationClient";
import { NodeAllocation } from "./NodeAllocation";

var client: ApplicationClient;
export class PanelNode {

    public readonly id: number;
    public readonly uuid: string;
    public readonly public: boolean;
    public name: string;
    public description: string;
    public location_id: number;
    public fqdn: string;
    public scheme: string;
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
    public nodeConfiguration: undefined | NodeConfiguration;
    public allocations: undefined | Array<NodeAllocation>

    constructor(applicationClient: ApplicationClient, nodePros: Node) {
        client = applicationClient;
        this.id = nodePros.attributes.id;
        this.uuid = nodePros.attributes.uuid;
        this.public = nodePros.attributes.public;
        this.name = nodePros.attributes.name;
        this.description = nodePros.attributes.description;
        this.location_id = nodePros.attributes.location_id;
        this.fqdn = nodePros.attributes.fqdn;
        this.scheme = nodePros.attributes.scheme;
        this.behind_proxy = nodePros.attributes.behind_proxy;
        this.maintenance_mode = nodePros.attributes.maintenance_mode;
        this.memory = nodePros.attributes.memory;
        this.memory_overallocate = nodePros.attributes.memory_overallocate;
        this.disk = nodePros.attributes.disk;
        this.disk_overallocate = nodePros.attributes.disk_overallocate;
        this.upload_size = nodePros.attributes.upload_size;
        this.daemon_listen = nodePros.attributes.daemon_listen;
        this.daemon_sftp = nodePros.attributes.daemon_sftp;
        this.daemon_base = nodePros.attributes.daemon_base;
        this.created_at = new Date(nodePros.attributes.created_at);
        this.updated_at = new Date(nodePros.attributes.updated_at);
    }

    /**
    * Get the config of this node
    */
    public async getConfiguration(): Promise<NodeConfiguration> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id + "/configuration");
        this.nodeConfiguration = await client.axiosRequest({ url: endpoint.href }) as NodeConfiguration
        return this.nodeConfiguration
    }

    /**
     * Update this node
     * @param nodeProperties The properties to update this node
     */
    public async update(nodeProperties: NodeUpdateProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/nodes" + this.id);
        const data = await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: nodeProperties }) as Node
        this.name = data.attributes.name;
        this.description = data.attributes.description;
        this.location_id = data.attributes.location_id;
        this.fqdn = data.attributes.fqdn;
        this.scheme = data.attributes.scheme;
        this.behind_proxy = data.attributes.behind_proxy;
        this.maintenance_mode = data.attributes.maintenance_mode;
        this.memory = data.attributes.memory;
        this.memory_overallocate = data.attributes.memory_overallocate;
        this.disk = data.attributes.disk;
        this.disk_overallocate = data.attributes.disk_overallocate;
        this.upload_size = data.attributes.upload_size;
        this.daemon_sftp = data.attributes.daemon_sftp;
        this.daemon_listen = data.attributes.daemon_listen;
        this.updated_at = new Date(data.attributes.updated_at);
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
        const endpoint = new URL(client.panel + "/api/application/nodes" + this.id + "/allocations");
        const data = await client.axiosRequest({ url: endpoint.href }) as AllocationList
        const res: Array<NodeAllocation> = []
        for (const allocation of data.data) {
            res.push(new NodeAllocation(client, allocation, this))
        }
        return res
    }

    /**
    * Create a allocation for this node
    */
    public async createAllocation(allocationProperties: AllocationCreateProperties): Promise<void> {
        const endpoint = new URL(client.panel + "/api/application/nodes/" + this.id + "/allocations");
        await client.axiosRequest({ url: endpoint.href, data: allocationProperties })
    }

}