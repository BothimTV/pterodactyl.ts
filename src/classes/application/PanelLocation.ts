import { Location } from "../../types/ApplicationApiResponse"
import { LocationUpdateProperties } from "../../types/RequestBodies"
import { ApplicationClient } from "./ApplicationClient"

var client: ApplicationClient
export class PanelLocation {

  public readonly id: number
  public short: string
  public long: string
  public updated_at: Date
  public readonly created_at: Date

  constructor(applicationClient: ApplicationClient, locationProps: Location) {
    client = applicationClient
    this.id = locationProps.attributes.id
    this.short = locationProps.attributes.short
    this.long = locationProps.attributes.long
    this.updated_at = new Date(locationProps.attributes.updated_at)
    this.created_at = new Date(locationProps.attributes.created_at)
  }

  /**
  * Update this location
  */
  public async update(updateProperties: LocationUpdateProperties): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations/" + this.id);
    const data = await client.axiosRequest({ url: endpoint.href, method: "PATCH", data: updateProperties }) as Location
    this.short = data.attributes.short
    this.long = data.attributes.long
    this.updated_at = new Date(data.attributes.updated_at)
  }

  /**
  * Delete this location
  */
  public async delete(): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations" + this.id);
    await client.axiosRequest({ url: endpoint.href, method: "DELETE" })
  }

}