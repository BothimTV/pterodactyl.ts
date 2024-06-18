export interface RawApiKeyList {
  object: "list";
  data: Array<RawApiKey>;
}

export interface RawApiKey {
  object: "api_key";
  attributes: ApiKeyAttributes;
}

export interface ApiKeyAttributes {
  identifier: string;
  description: string;
  allowed_ips: Array<string>;
  last_used_at: string | Date;
  created_at: string | Date;
}
