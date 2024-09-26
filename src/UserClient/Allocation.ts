import { AllocationAttributes, RawAllocation } from "../types/user/allocation";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient;
export class Allocation implements AllocationAttributes {
  readonly id: number;
  readonly ip: string;
  readonly ip_alias?: string;
  readonly port: number;
  notes?: string | null;
  is_default: boolean;
  readonly parentServer: Server;

  constructor(
    userClient: UserClient,
    allocationProps: RawAllocation,
    parentServer: Server,
  ) {
    client = userClient;
    this.id = allocationProps.attributes.id;
    this.ip = allocationProps.attributes.ip;
    this.ip_alias = allocationProps.attributes.ip_alias;
    this.port = allocationProps.attributes.port;
    this.notes = allocationProps.attributes.notes;
    this.is_default = allocationProps.attributes.is_default;
    this.parentServer = parentServer;
  }

  /**
   * Set the notes of this allocation
   */
  public async setNotes(notes: string): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/network/allocations/" +
        this.id,
    );
    const data = { notes: notes };
    const res = (await client.api({
      url: endpoint.href,
      method: "POST",
      data: data,
    })) as RawAllocation;
    this.notes = res.attributes.notes;
  }

  /**
   * Set the notes of this allocation
   */
  public async setPrimary(): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/network/allocations/" +
        this.id +
        "/primary",
    );
    const res = (await client.api({
      url: endpoint.href,
      method: "POST",
    })) as RawAllocation;
    this.is_default = res.attributes.is_default;
  }

  /**
   * Remove this allocation from this Server
   * To be able to unassign this allocation this CAN NOT be the primary allocation!
   */
  public async unassign(): Promise<void> {
    if (this.is_default)
      console.warn(
        "This allocation is locally set as primary location, this will most likely be rejected by the panel!",
      );
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/network/allocations/" +
        this.id,
    );
    await client.api({ url: endpoint.href, method: "DELETE" }, [
      {
        code: 400,
        message: "Cannot delete the primary allocation for a server.",
      },
    ]);
  }
}
