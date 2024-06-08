import axios, { AxiosRequestConfig } from "axios";
import { CreateUser, Location, LocationList, Node, NodeList, User, UserList } from "../../types/ApplicationApiResponse";
import { LocationCreateProperties, NodeCreateProperties, UserCreateProperties } from "../../types/RequestBodies";
import { ClientOptions } from "../../types/Util";
import { PanelLocation } from "./PanelLocation";
import { PanelNode } from "./PanelNode";
import { PanelUser } from "./PanelUser";

export class ApplicationClient {
  protected apikey: string;
  public panel: string;
  constructor(options: ClientOptions) {
    this.apikey = "Bearer " + options.apikey;
    this.panel = options.panel;
  }

  public async axiosRequest(config: AxiosRequestConfig): Promise<any> {
    config.headers = config.headers ? config.headers : {};
    config.headers["Authorization"] = this.apikey;
    return await axios.request(config).then((res) => {
      return res.data;
    }).catch(error => {
      throw new Error(error);
    });
  }

  /**
   *
   *  User management
   *
   */
  /**
   * Get all users associated to the panel
   * @param filter Filter users by email, uuid, username and/or externalId
   * @param sortBy Sort users by id oder uuid
   * @param reverseSort Reverse the sort@requires sortBy
   */
  public async getUsers(filter?: { email?: string; uuid?: string; username?: string; externalId?: string; }, sortBy?: "id" | "uuid", reverseSort?: boolean): Promise<Array<PanelUser>> {
    var endpoint = new URL(this.panel + "/api/application/users");
    if (filter?.email) endpoint.searchParams.append("filter[email]", filter.email);
    if (filter?.username) endpoint.searchParams.append("filter[username]", filter.username);
    if (filter?.uuid) endpoint.searchParams.append("filter[uuid]", filter.uuid);
    if (filter?.externalId) endpoint.searchParams.append("filter[external_id]", filter.externalId);
    if (sortBy) endpoint.searchParams.append("sort", `${reverseSort ? "-" : ""}${sortBy}`);
    const users = await this.axiosRequest({ url: endpoint.href, }) as UserList
    const res: Array<PanelUser> = [];
    for (const user of users.data) {
      res.push(new PanelUser(this, user));
    }
    return res;
  }

  /**
   * Get a user via their userId
   * @param userId The id of a user
   */
  public async getUser(userId: number): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users/" + userId);
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href }) as User);
  }

  /**
  * Get a user via their external id
  * @param externalId The external id of a user
  */
  public async getExternalUser(externalId: string): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users/external/" + externalId);
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href }) as User)
  }

  /**
   * Create a user
   * @param userProperties The details for a user
   */
  public async createUser(userProperties: UserCreateProperties): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users");
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: userProperties }) as CreateUser);
  }

  /**
   *
   * Node management
   *
   */


  /**
   * Get all nodes of a panel
   */
  public async getNodes(): Promise<Array<PanelNode>> {
    const endpoint = new URL(this.panel + "/api/application/nodes");
    const data = await this.axiosRequest({ url: endpoint.href }) as NodeList
    const res: Array<PanelNode> = [];
    for (const node of data.data) {
      res.push(new PanelNode(this, node));
    }
    return res;
  }

  /**
   * Get a specific Node by nodeId
   * @param nodeId The id of the specific node
   */
  public async getNode(nodeId: number): Promise<PanelNode> {
    const endpoint = new URL(this.panel + "/api/application/nodes/" + nodeId);
    return new PanelNode(this, await this.axiosRequest({ url: endpoint.href }) as Node)
  }

  /**
  * Create a node
  * @param nodeProperties The properties for the new node
  */
  public async createNode(nodeProperties: NodeCreateProperties): Promise<PanelNode> {
    const endpoint = new URL(this.panel + "/api/application/nodes");
    return new PanelNode(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: nodeProperties }) as Node)
  }

  /**
  * Get the locations of this panel
  */
  public async getLocations(): Promise<Array<PanelLocation>> {
    const endpoint = new URL(this.panel + "/api/application/locations");
    const data = await this.axiosRequest({ url: endpoint.href }) as LocationList
    const res: Array<PanelLocation> = [];
    for (const location of data.data) {
      res.push(new PanelLocation(this, location));
    }
    return res;
  }

  /**
  * Get a location of this panel
  */
  public async getLocation(locationId: number): Promise<PanelLocation> {
    const endpoint = new URL(this.panel + "/api/application/locations/" + locationId );
    return new PanelLocation(this, await this.axiosRequest({ url: endpoint.href }) as Location)
  }

  /**
  * Create a location for this panel
  */
  public async createLocation(locationProperties: LocationCreateProperties): Promise<PanelLocation> {
    const endpoint = new URL(this.panel + "/api/application/locations");
    return new PanelLocation(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: locationProperties }) as Location)
  }
  
  

}
