import { LocationBuilder } from "../builder/LocationBuilder"
import { LocationAttributes, RawLocation } from "../types/location"
import { ApplicationClient } from "./ApplicationClient"

var client: ApplicationClient
export class PanelLocation implements LocationAttributes{

  public readonly id: number
  public short: string
  public long?: string | null
  public updated_at: Date
  public readonly created_at: Date

  constructor(applicationClient: ApplicationClient, locationProps: RawLocation) {
    client = applicationClient
    this.id = locationProps.attributes.id
    this.short = locationProps.attributes.short
    this.long = locationProps.attributes.long
    this.updated_at = new Date(locationProps.attributes.updated_at)
    this.created_at = new Date(locationProps.attributes.created_at)
  }

  /**
  * Update this location
  * FIXME: @deprecated
  */
  public async update(updateProperties: LocationBuilder): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations/" + this.id);
    const data = await client.api({ url: endpoint.href, method: "PATCH", data: updateProperties }) as RawLocation
    this.short = data.attributes.short
    this.long = data.attributes.long
    this.updated_at = new Date(data.attributes.updated_at)
  }

  /**
  * Delete this location
  */
  public async delete(): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations" + this.id);
    await client.api({ url: endpoint.href, method: "DELETE" })
  }

}