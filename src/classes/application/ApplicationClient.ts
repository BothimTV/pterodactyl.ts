import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CreateUser, Location, LocationList, Node, NodeList, Server, ServerList, User, UserList } from "../../types/ApplicationApiResponse";
import { LocationCreateProperties } from "../../types/RequestBodies";
import { ClientOptions } from "../../types/Util";
import { PanelNodeBuilder } from "../builder/PanelNodeBuilder";
import { PanelUserBuilder } from "../builder/PanelUserBuilder";
import { ServerBuilder } from "../builder/ServerBuilder";
import { ApplicationServer } from "./ApplicationServer";
import { PanelLocation } from "./PanelLocation";
import { PanelNode } from "./PanelNode";
import { PanelUser } from "./PanelUser";

export class ApplicationClient {
  protected apikey: string;
  public panel: string;
  constructor(options: ClientOptions) {
    this.apikey = "Bearer " + options.apikey;
    this.panel = options.panel;
    

    try {
      new URL(this.panel);
    } catch (error) {
      throw new Error("Invalid panel url");
    }
  }

  public async axiosRequest(config: AxiosRequestConfig, errorSet?: Array<{ code: number; message: string; }>, ignoredErrors?: Array<string>): Promise<any> {
    config.headers = config.headers ? config.headers : {};
    config.headers["Authorization"] = this.apikey;
    return await axios.request(config).then((res) => {
      return res.data;
    }).catch((e) => {
      const error = e as AxiosError;
      const msg = errorSet?.find(e => e.code === error.response?.status)
      if (msg) {
        throw new Error(msg.message);
      } else {
        if (error.response?.data) {
          const msg = error.response?.data as {errors: Array<{code: string, status: string, detail: string}>}
          if (ignoredErrors) {
            for (const ignoredError of ignoredErrors) {
              if (msg.errors.some(e => e.code === ignoredError)) {
                return null
              }
            }
          }
          msg.errors.forEach((err, i) => {
            if (msg.errors.length - 1 == i) {
              throw new Error(err.code + ": " + err.detail)
            } else {
              console.error(err.code + ": " + err.detail)
            }
          })
        } else {
          throw new Error(error.response?.status + " - " + error.response?.statusText || "An error occurred while communicating with the API")
        }
        console.error(error.response?.data)
        //throw new Error("An error occurred while communicating with the API, code: " + error.response?.status + " - " + error.response?.statusText)
      }
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
   * @param reverseSort Reverse the sort @requires sortBy
   */
  public async getUsers(filter?: { email?: string; uuid?: string; username?: string; externalId?: string; }, sortBy?: "id" | "uuid", reverseSort?: boolean): Promise<Array<PanelUser>> {
    var endpoint = new URL(this.panel + "/api/application/users?include=servers"); // FIXME: Include servers in data
    if (filter?.email) endpoint.searchParams.append("filter[email]", filter.email);
    if (filter?.username) endpoint.searchParams.append("filter[username]", filter.username);
    if (filter?.uuid) endpoint.searchParams.append("filter[uuid]", filter.uuid);
    if (filter?.externalId) endpoint.searchParams.append("filter[external_id]", filter.externalId);
    if (sortBy) endpoint.searchParams.append("sort", `${reverseSort ? "-" : ""}${sortBy}`);
    const users = await this.axiosRequest({ url: endpoint.href, }) as UserList
    return users.data.map(user => new PanelUser(this, user));
  }

  /**
   * Get a user via their userId
   * @param userId The id of a user
   */
  public async getUser(userId: number): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users/" + userId + "?include=servers"); // FIXME: Include servers in data
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href }) as User);
  }

  /**
  * Get a user via their external id
  * @param externalId The external id of a user
  */
  public async getExternalUser(externalId: string): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users/external/" + externalId + "?include=servers");  // FIXME: Include servers in data
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href }) as User)
  }

  /**
   * Create a user
   * @param userProperties Construct a user via new PanelUserBuilder()
   */
  public async createUser(userProperties: PanelUserBuilder): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users");
    return new PanelUser(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: userProperties }, [{ code: 422, message: "There is already a user with this email and/or username" }]) as CreateUser);
  }

  /**
   * Get all nodes of a panel
   */
  public async getNodes(): Promise<Array<PanelNode>> {
    const endpoint = new URL(this.panel + "/api/application/nodes?include=allocations,locations,servers");  // FIXME: Include include data
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
    const endpoint = new URL(this.panel + "/api/application/nodes/" + nodeId + "?include=allocations,locations,servers"); // FIXME: Include include data
    return new PanelNode(this, await this.axiosRequest({ url: endpoint.href }) as Node)
  }

  /**
  * Create a node
  * @param nodeProperties The properties for the new node
  */
  public async createNode(nodeProperties: PanelNodeBuilder): Promise<PanelNode> {
    const endpoint = new URL(this.panel + "/api/application/nodes");
    return new PanelNode(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: nodeProperties }) as Node)
  }

  /**
  * Get the locations of this panel
  */
  public async getLocations(): Promise<Array<PanelLocation>> {
    const endpoint = new URL(this.panel + "/api/application/locations?include=nodes,servers"); // FIXME: Include include data
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
    const endpoint = new URL(this.panel + "/api/application/locations/" + locationId + "?include=nodes,servers");
    return new PanelLocation(this, await this.axiosRequest({ url: endpoint.href }) as Location)
  }

  /**
  * Create a location for this panel
  */
  public async createLocation(locationProperties: LocationCreateProperties): Promise<PanelLocation> {
    const endpoint = new URL(this.panel + "/api/application/locations");
    return new PanelLocation(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: locationProperties }) as Location)
  }

  /**
  * Get servers for this panel
  */
  public async getServers(): Promise<Array<ApplicationServer>> {
    const endpoint = new URL(this.panel + "/api/application/servers");
    const data = await this.axiosRequest({ url: endpoint.href }) as ServerList
    const res: Array<ApplicationServer> = [];
    for (const server of data.data) {
      res.push(new ApplicationServer(this, server));
    }
    return res;
  }

  /**
  * Get a server for this panel
  * @param serverId The target server Id
  */
  public async getServer(serverId: number): Promise<ApplicationServer> {
    const endpoint = new URL(this.panel + "/api/application/servers/" + serverId + "?include=allocations,user,subusers,pack,nest,egg,variables,location,node,databases"); // FIXME: Include include data
    return new ApplicationServer(this, await this.axiosRequest({ url: endpoint.href }) as Server)
  }

  /**
  * Get a server by their external id
  * @prop externalId The target servers external id
  */
  public async getExternalServer(externalId: string): Promise<ApplicationServer> {
    const endpoint = new URL(this.panel + "/api/application/servers/external/" + externalId + "?include=allocations,user,subusers,pack,nest,egg,variables,location,node,databases"); // FIXME: Include include data
    return new ApplicationServer(this, await this.axiosRequest({ url: endpoint.href }) as Server)
  }

  /**
  * Create a server
  */
  public async createServer(serverProperties: ServerBuilder): Promise<ApplicationServer> {
    const endpoint = new URL(this.panel + "/api/application/servers");
    return new ApplicationServer(this, await this.axiosRequest({ url: endpoint.href, method: "POST", data: serverProperties }) as Server)
  }

  /**
   * Get the nests of this panel
   */
  public async getNests(): Promise<Array<any>> {
    const endpoint = new URL(this.panel + "/api/application/nests?include=eggs,servers"); // FIXME: Include include data
    throw new Error("Not implemented yet");
  }

  /**
   * Get a nest by id of this panel
   * @param nestId The id of the nest you want to get
   */
  public async getNest(nestId: number): Promise<any> {
    const endpoint = new URL(this.panel + "/api/application/nests/" + nestId + "?include=eggs,servers"); // FIXME: Include include data
    throw new Error("Not implemented yet"); 
  }

  /**
   * Get the eggs of this panel
   * @param nestId The if of the nest you want to get the eggs from 
   */
  public async getEggs(nestId: number): Promise<Array<any>> {
    const endpoint = new URL(this.panel + "/api/application/nests/" + nestId + "/eggs?include=nest,servers,config,script,variables"); // FIXME: Include include data
    throw new Error("Not implemented yet"); 
  }

  /**
   * Get a specific egg of this panel
   * @param nestId The if of the nest you want to get the egg from
   * @param eggId The egg you want to get 
   */
  public async getEgg(nestId: number, eggId: number): Promise<any> {
    const endpoint = new URL(this.panel + "/api/application/nests/" + nestId + "/eggs/" + eggId + "?include=nest,servers,config,script,variables"); // FIXME: Include include data
    throw new Error("Not implemented yet"); 
  }


}
