import { LocationAttributes, RawLocation } from "../types/application/location"
import { ApplicationClient } from "./ApplicationClient"

var client: ApplicationClient
export class PanelLocation implements LocationAttributes {

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

  private updateProps() {
    return {
      short: this.short,
      long: this.long
    }
  }

  private updateThis(location: RawLocation) {
    this.short = location.attributes.short
    this.long = location.attributes.long
    this.updated_at = new Date(location.attributes.updated_at)
  }

  /**
   * Set the new short name for this location
   * @param short The new name
   */
  public async setShort(short: string): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations/" + this.id);
    var data = this.updateProps()
    data.short = short
    this.updateThis(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawLocation)
  }

  /**
   * Set the new description for this location
   * @param long The new description, can be an empty string
   */
  public async setDescription(long: string): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations/" + this.id);
    var data = this.updateProps()
    data.long = long
    this.updateThis(await client.api({ url: endpoint.href, method: "PATCH", data: data }) as RawLocation)
  }

  /**
  * Delete this location
  */
  public async delete(): Promise<void> {
    const endpoint = new URL(client.panel + "/api/application/locations" + this.id);
    await client.api({ url: endpoint.href, method: "DELETE" })
  }

}