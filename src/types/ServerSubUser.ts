export interface RawServerSubUserList {
  object: "list";
  data: Array<RawServerSubUser>;
}

export interface RawServerSubUser {
  object: "subuser"; // FIXME: Possibly incorrect
  attributes: ServerSubUserAttributes;
}

export interface ServerSubUserAttributes {}
