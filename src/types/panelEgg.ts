export interface RawPanelEggList {
  object: "list";
  data: Array<RawPanelEgg>;
}

export interface RawPanelEgg {
  object: "egg";
  attributes: PanelEggAttributes;
}

export interface PanelEggAttributes {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
  nest: number;
  readonly author: string;
  description?: null | string;
  docker_image: string;
  docker_images: { [key: string]: string };
  config: {
    files: {
      [key: string]: {
        parser: string;
        find: { [key: string]: string };
      };
    };
    startup: {
      done: string;
      userInteraction: Array<unknown>;
    };
    stop: string;
    logs: Array<unknown>;
    file_denylist: Array<unknown>;
    extends?: null | string;
  };
  startup: string;
  script: {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends?: null | string;
  };
  readonly created_at: string;
  updated_at: string;
}
