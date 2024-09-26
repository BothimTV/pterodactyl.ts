import { BaseClient, ClientOptions } from "../BaseClient/BaseClient";
import { LocationBuilder } from "../builder/LocationBuilder";
import { NodeBuilder } from "../builder/NodeBuilder";
import { ServerBuilder } from "../builder/ServerBuilder";
import { UserBuilder } from "../builder/UserBuilder";
import { RawLocation, RawLocationList } from "../types/application/location";
import { RawPanelEgg, RawPanelEggList } from "../types/application/panelEgg";
import { RawPanelNest, RawPanelNestList } from "../types/application/panelNest";
import { RawPanelNode, RawPanelNodeList } from "../types/application/panelNode";
import { RawServer, RawServerList } from "../types/application/server";
import { RawUser, RawUserList } from "../types/application/user";
import { Egg } from "./Egg";
import { Nest } from "./Nest";
import { PanelLocation } from "./PanelLocation";
import { PanelNode } from "./PanelNode";
import { PanelServer } from "./PanelServer";
import { PanelUser } from "./PanelUser";

export class ApplicationClient extends BaseClient {
  constructor(options: ClientOptions) {
    super(options);
  }

  /**
   * Get all users associated to the panel
   * @param filter Filter users by email, uuid, username and/or externalId
   * @param sortBy Sort users by id oder uuid
   * @param reverseSort Reverse the sort @requires sortBy
   */
  public async getUsers(
    filter?: {
      email?: string;
      uuid?: string;
      username?: string;
      externalId?: string;
    },
    sortBy?: "id" | "uuid",
    reverseSort?: boolean,
  ): Promise<Array<PanelUser>> {
    var endpoint = new URL(
      this.panel + "/api/application/users?include=servers",
    );
    if (filter?.email)
      endpoint.searchParams.append("filter[email]", filter.email);
    if (filter?.username)
      endpoint.searchParams.append("filter[username]", filter.username);
    if (filter?.uuid) endpoint.searchParams.append("filter[uuid]", filter.uuid);
    if (filter?.externalId)
      endpoint.searchParams.append("filter[external_id]", filter.externalId);
    if (sortBy)
      endpoint.searchParams.append(
        "sort",
        `${reverseSort ? "-" : ""}${sortBy}`,
      );
    const users = (await this.api({ url: endpoint.href })) as RawUserList;
    return users.data.map((user) => new PanelUser(this, user));
  }

  /**
   * Get a user via their userId
   * @param userId The id of a user
   */
  public async getUser(userId: number): Promise<PanelUser> {
    const endpoint = new URL(
      this.panel + "/api/application/users/" + userId + "?include=servers",
    );
    return new PanelUser(
      this,
      (await this.api({ url: endpoint.href })) as RawUser,
    );
  }

  /**
   * Get a user via their external id
   * @param externalId The external id of a user
   */
  public async getExternalUser(externalId: string): Promise<PanelUser> {
    const endpoint = new URL(
      this.panel +
        "/api/application/users/external/" +
        externalId +
        "?include=servers",
    );
    return new PanelUser(
      this,
      (await this.api({ url: endpoint.href })) as RawUser,
    );
  }

  /**
   * Create a user
   * @param userProperties Construct a user via new UserBuilder()
   */
  public async createUser(userProperties: UserBuilder): Promise<PanelUser> {
    const endpoint = new URL(this.panel + "/api/application/users");
    return new PanelUser(
      this,
      (await this.api(
        { url: endpoint.href, method: "POST", data: userProperties },
        [
          {
            code: 422,
            message: "There is already a user with this email and/or username",
          },
        ],
      )) as RawUser,
    );
  }

  /**
   * Get all nodes of a panel
   */
  public async getNodes(): Promise<Array<PanelNode>> {
    const endpoint = new URL(
      this.panel +
        "/api/application/nodes?include=allocations,location,servers",
    );
    const data = (await this.api({ url: endpoint.href })) as RawPanelNodeList;
    return data.data.map((node) => new PanelNode(this, node));
  }

  /**
   * Get a specific Node by nodeId
   * @param nodeId The id of the specific node
   */
  public async getNode(nodeId: number): Promise<PanelNode> {
    const endpoint = new URL(
      this.panel +
        "/api/application/nodes/" +
        nodeId +
        "?include=allocations,location,servers",
    );
    return new PanelNode(
      this,
      (await this.api({ url: endpoint.href })) as RawPanelNode,
    );
  }

  /**
   * Create a node
   * @param nodeProperties The properties for the new node
   */
  public async createNode(nodeProperties: NodeBuilder): Promise<PanelNode> {
    const endpoint = new URL(this.panel + "/api/application/nodes");
    return new PanelNode(
      this,
      (await this.api({
        url: endpoint.href,
        method: "POST",
        data: nodeProperties,
      })) as RawPanelNode,
    );
  }

  /**
   * Get the locations of this panel
   */
  public async getLocations(): Promise<Array<PanelLocation>> {
    const endpoint = new URL(
      this.panel + "/api/application/locations?include=nodes,servers",
    );
    const data = (await this.api({ url: endpoint.href })) as RawLocationList;
    return data.data.map((location) => new PanelLocation(this, location));
  }

  /**
   * Get a location of this panel
   */
  public async getLocation(locationId: number): Promise<PanelLocation> {
    const endpoint = new URL(
      this.panel +
        "/api/application/locations/" +
        locationId +
        "?include=nodes,servers",
    );
    return new PanelLocation(
      this,
      (await this.api({ url: endpoint.href })) as RawLocation,
    );
  }

  /**
   * Create a location for this panel
   */
  public async createLocation(
    locationProperties: LocationBuilder,
  ): Promise<PanelLocation> {
    const endpoint = new URL(this.panel + "/api/application/locations");
    return new PanelLocation(
      this,
      (await this.api({
        url: endpoint.href,
        method: "POST",
        data: locationProperties,
      })) as RawLocation,
    );
  }

  /**
   * Get servers for this panel
   */
  public async getServers(): Promise<Array<PanelServer>> {
    const endpoint = new URL(this.panel + "/api/application/servers");
    const data = (await this.api({ url: endpoint.href })) as RawServerList;
    return data.data.map((server) => new PanelServer(this, server));
  }

  /**
   * Get a server for this panel
   * @param serverId The target server Id
   */
  public async getServer(serverId: number): Promise<PanelServer> {
    const endpoint = new URL(
      this.panel +
        "/api/application/servers/" +
        serverId +
        "?include=allocations,user,subusers,pack,nest,egg,variables,location,node,databases",
    );
    return new PanelServer(
      this,
      (await this.api({ url: endpoint.href })) as RawServer,
    );
  }

  /**
   * Get a server by their external id
   * @prop externalId The target servers external id
   */
  public async getExternalServer(externalId: string): Promise<PanelServer> {
    const endpoint = new URL(
      this.panel +
        "/api/application/servers/external/" +
        externalId +
        "?include=allocations,user,subusers,pack,nest,egg,variables,location,node,databases",
    );
    return new PanelServer(
      this,
      (await this.api({ url: endpoint.href })) as RawServer,
    );
  }

  /**
   * Create a server
   */
  public async createServer(
    serverProperties: ServerBuilder,
  ): Promise<PanelServer> {
    const endpoint = new URL(this.panel + "/api/application/servers");
    return new PanelServer(
      this,
      (await this.api({
        url: endpoint.href,
        method: "POST",
        data: serverProperties,
      })) as RawServer,
    );
  }

  /**
   * Get the nests of this panel
   */
  public async getNests(): Promise<Array<Nest>> {
    const endpoint = new URL(
      this.panel + "/api/application/nests?include=eggs,servers",
    );
    const data = (await this.api({ url: endpoint.href })) as RawPanelNestList;
    return data.data.map((nest) => new Nest(this, nest));
  }

  /**
   * Get a nest by id of this panel
   * @param nestId The id of the nest you want to get
   */
  public async getNest(nestId: number): Promise<Nest> {
    const endpoint = new URL(
      this.panel + "/api/application/nests/" + nestId + "?include=eggs,servers",
    );
    return new Nest(
      this,
      (await this.api({ url: endpoint.href })) as RawPanelNest,
    );
  }

  /**
   * Get the eggs of this panel
   * @param nestId The if of the nest you want to get the eggs from
   */
  public async getEggs(nestId: number): Promise<Array<Egg>> {
    const endpoint = new URL(
      this.panel +
        "/api/application/nests/" +
        nestId +
        "/eggs?include=nest,servers,config,script,variables",
    );
    const data = (await this.api({ url: endpoint.href })) as RawPanelEggList;
    return data.data.map((egg) => new Egg(this, egg));
  }

  /**
   * Get a specific egg of this panel
   * @param nestId The if of the nest you want to get the egg from
   * @param eggId The egg you want to get
   */
  public async getEgg(nestId: number, eggId: number): Promise<Egg> {
    const endpoint = new URL(
      this.panel +
        "/api/application/nests/" +
        nestId +
        "/eggs/" +
        eggId +
        "?include=nest,servers,config,script,variables",
    );
    return new Egg(
      this,
      (await this.api({ url: endpoint.href })) as RawPanelEgg,
    );
  }
}
