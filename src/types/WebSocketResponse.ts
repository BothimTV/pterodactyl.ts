import { PowerAction, ServerState } from "./Util";

//  Receive

export type AuthSuccess = { event: "auth success" };
export type Status = { event: "status"; args: [ServerState] };
export type ConsoleOutput = {
  event: "console output";
  args: [string];
};
export type Stats = {
  event: "stats";
  args: [
    string // FIXME: StatsData
  ];
};
export type StatsData = {
  memory_bytes: number;
  memory_limit_bytes: number;
  cpu_absolute: number;
  network: { rx_bytes: number; tx_bytes: number };
  state: ServerState;
  disk_bytes: number;
};
export type TokenExpiring = { event: "token expiring" };
export type TokenExpired = { event: "token expired" };

// Send

export type Auth = { event: "auth"; args: [string] };
export type GetStats = { event: "send stats"; args: [null] };
export type GetLogs = { event: "send logs"; args: [null] };
export type SetState = { event: "set state"; args: [PowerAction] };
export type SendCommand = { event: "send command"; args: [string] };
