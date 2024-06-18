export interface RawNodeConfiguration {
  readonly debug: boolean;
  readonly uuid: string;
  readonly token_id: string;
  readonly token: string;
  readonly api: {
    readonly host: string;
    readonly port: 8080 | number;
    readonly ssl: {
      readonly enabled: boolean;
      readonly cert: string;
      readonly key: string;
    };
    readonly upload_limit: number;
  };
  readonly system: {
    readonly data: string;
    readonly sftp: {
      readonly bind_port: 2022 | number;
    };
  };
  readonly allowed_mounts: Array<unknown>;
  readonly remote: string;
}
