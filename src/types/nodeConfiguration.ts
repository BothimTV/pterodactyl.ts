export interface RawNodeConfiguration {
    object: "node_configuration"; //TODO: Check if this is valid
    attributes: NodeConfigurationAttributes;
}

export interface NodeConfigurationAttributes {
    debug: boolean;
    uuid: string;
    token_id: string;
    token: string;
    api: {
      host: string;
      port: 8080 | number;
      ssl: {
        enabled: boolean;
        cert: string;
        key: string;
      };
      upload_limit: number;
    };
    system: {
      data: string;
      sftp: {
        bind_port: 2022 | number;
      };
    };
    remote: string;
  };