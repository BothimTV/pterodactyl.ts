export interface RawApiKeyList {
  object: "list";
  data: Array<RawApiKey>;
}

export interface RawApiKey {
  object: "api_key";
  attributes: ApiKeyAttributes;
  meta?: {
    secret_token: string
  }
}

export interface ApiKeyAttributes {
  readonly identifier: string;
  readonly description: string;
  readonly allowed_ips: Array<string>;
  readonly last_used_at: string | Date;
  readonly created_at: string | Date;
}
