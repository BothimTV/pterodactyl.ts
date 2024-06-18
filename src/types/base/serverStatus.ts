export type ServerStatus = "starting" | "stopping" | "online" | "offline";

export const ServerSignal = {
  START: "start",
  STOP: "stop",
  RESTART: "restart",
  KILL: "kill",
};

export type ServerSignalOption = "start" | "stop" | "restart" | "kill";
