import { PanelEggAttributes, RawPanelEgg } from "../types/application/panelEgg";
import { RawPanelNest } from "../types/application/panelNest";
import { RawServerList } from "../types/application/server";
import { RawServerVariableList } from "../types/application/serverVariable";
import { ApplicationClient } from "./ApplicationClient";
import { Nest } from "./Nest";
import { PanelServer } from "./PanelServer";
import { ServerVariable } from "./ServerVariable";

var client: ApplicationClient;
var relationships:
  | {
      nest?: RawPanelNest;
      servers?: RawServerList;
      variables?: RawServerVariableList;
    }
  | undefined;
export class Egg implements PanelEggAttributes {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
  readonly nest: number;
  readonly author: string;
  description?: string | null | undefined;
  docker_image: string;
  docker_images: { [key: string]: string };
  readonly config: {
    files: {
      [key: string]: { parser: string; find: { [key: string]: string } };
    };
    startup: { done: string; userInteraction: unknown[] };
    stop: string;
    logs: unknown[];
    file_denylist: unknown[];
    extends?: string | null | undefined;
  };
  startup: string;
  script: {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends?: string | null | undefined;
  };
  readonly created_at: string | Date;
  updated_at: string | Date;
  parentNest?: Nest;
  associatedServers?: Array<PanelServer>;
  associatedVariables?: Array<ServerVariable>;

  constructor(applicationClient: ApplicationClient, eggProps: RawPanelEgg) {
    this.id = eggProps.attributes.id;
    this.uuid = eggProps.attributes.uuid;
    this.name = eggProps.attributes.name;
    this.nest = eggProps.attributes.nest;
    this.author = eggProps.attributes.author;
    this.description = eggProps.attributes.description;
    this.docker_image = eggProps.attributes.docker_image;
    this.docker_images = eggProps.attributes.docker_images;
    this.config = eggProps.attributes.config;
    this.startup = eggProps.attributes.startup;
    this.script = eggProps.attributes.script;
    this.created_at = new Date(eggProps.attributes.created_at);
    this.updated_at = new Date(eggProps.attributes.updated_at);
    relationships = eggProps.attributes.relationships;
    if (relationships?.nest)
      this.parentNest = new Nest(applicationClient, relationships.nest);
    if (relationships?.servers)
      this.associatedServers = relationships.servers.data.map(
        (srv) => new PanelServer(applicationClient, srv),
      );
    if (relationships?.variables)
      this.associatedVariables = relationships.variables.data.map(
        (variable) => new ServerVariable(variable),
      );
    client = applicationClient;
  }

  /**
   * There are no methods documented :/
   * Are there methods that would be practical to have?
   */
}
