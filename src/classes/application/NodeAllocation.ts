import { Allocation } from "../../types/ApplicationApiResponse";
import { ApplicationClient } from "./ApplicationClient";
import { PanelNode } from "./PanelNode";

export class NodeAllocation {
    private readonly client: ApplicationClient;
    private readonly node: PanelNode;
    public readonly id: number;
    public readonly ip: string;
    public readonly alias: null | string;
    public readonly port: number;
    public readonly notes: null | string;
    public readonly assigned: boolean;

    constructor(client: ApplicationClient, allocationPros: Allocation, node: PanelNode) {
        this.client = client;
        this.node = node;
        this.id = allocationPros.attributes.id;
        this.ip = allocationPros.attributes.ip;
        this.alias = allocationPros.attributes.alias;
        this.port = allocationPros.attributes.port;
        this.notes = allocationPros.attributes.notes;
        this.assigned = allocationPros.attributes.assigned;
    }

    /**
     * Delete this allocation
     */
    public async delete(): Promise<void> {
        const endpoint = new URL(this.client.panel + "/api/application/nodes/" + this.node.id + "/allocations/" + this.id);
        await this.client.axiosRequest({ url: endpoint.href, method: "DELETE" })
    }


}