export type ServerStatus = "NOT IMPLEMENTED YET!" | "NOT IMPLEMENTED YET!2";
// TODO: Add status type

export const ServerSignal = {
  START: "start",
  STOP: "stop",
  RESTART: "restart",
  KILL: "kill",
};

export type ServerSignalOption = "start" | "stop" | "restart" | "kill";
