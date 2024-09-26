import { NodeAllocationAttributes, RawNodeAllocation } from '../types/application/nodeAllocation';
import { ApplicationClient } from './ApplicationClient';
import { PanelNode } from './PanelNode';

var client: ApplicationClient;
export class NodeAllocation implements NodeAllocationAttributes {
  protected nodeId: number;
  public readonly id: number;
  public readonly ip: string;
  public readonly alias?: null | string;
  public readonly port: number;
  public readonly notes?: null | string;
  public readonly assigned: boolean;

  constructor(applicationClient: ApplicationClient, allocationProps: RawNodeAllocation, node: PanelNode | number) {
    client = applicationClient;
    this.nodeId = typeof node == 'number' ? node : node.id;
    this.id = allocationProps.attributes.id;
    this.ip = allocationProps.attributes.ip;
    this.alias = allocationProps.attributes.alias;
    this.port = allocationProps.attributes.port;
    this.notes = allocationProps.attributes.notes;
    this.assigned = allocationProps.attributes.assigned;
  }

  /**
   * Delete this allocation
   */
  public async delete(): Promise<void> {
    const endpoint = new URL(client.panel + '/api/application/nodes/' + this.nodeId + '/allocations/' + this.id);
    await client.api({ url: endpoint.href, method: 'DELETE' });
  }
}
