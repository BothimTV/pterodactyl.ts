export type WebsocketEvent =
    | AuthSuccessWsEvent
    | StatusWsEvent
    | ConsoleLogWsEvent
    | StatsWsEvent
    | TokenExpiringWsEvent
    | TokenExpiredWsEvent
    | DaemonErrorEvent;

export type AuthSuccessWsEvent = {
    event: "auth success";
};

export type StatusWsEvent = { event: "status"; args: [PowerState] };

export type PowerState = "starting" | "stopping" | "online" | "offline";

export type ConsoleLogWsEvent = {
    event: "console output";
    args: [string];
};

export type StatsWsEvent = {
    event: "stats";
    args: [string];
};

export type StatsWsJson = {
    memory_bytes: number;
    memory_limit_bytes: number;
    cpu_absolute: number;
    network: { rx_bytes: number; tx_bytes: number };
    state: PowerState;
    disk_bytes: number;
}

export type TokenExpiringWsEvent = { event: "token expiring" };

export type TokenExpiredWsEvent = { event: "token expired" };

export type DaemonErrorEvent = { event: "daemon error", args: [string]}