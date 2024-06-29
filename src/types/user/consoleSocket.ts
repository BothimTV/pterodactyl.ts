export type WebsocketEvent =
    | AuthSuccessWsEvent
    | StatusWsEvent
    | ConsoleLogWsEvent
    | StatsWsEvent
    | TokenExpiringWsEvent
    | TokenExpiredWsEvent
    | DaemonErrorEvent
    | DaemonMessageEvent
    | InstallOutputEvent
    | InstallStartedEvent
    | InstallCompletedEvent
    | TransferLogsEvent
    | TransferStatusEvent
    | BackupCompletedEvent
    | BackupRestoreCompletedEvent;

/**
 * Source: https://github.com/pterodactyl/panel/blob/1.0-develop/resources/scripts/components/server/events.ts
 */
export enum SocketEvent {
    AUTH_SUCCESS = 'auth_success',
    DAEMON_MESSAGE = 'daemon message',
    DAEMON_ERROR = 'daemon error',
    INSTALL_OUTPUT = 'install output',
    INSTALL_STARTED = 'install started',
    INSTALL_COMPLETED = 'install completed',
    CONSOLE_OUTPUT = 'console output',
    STATUS = 'status',
    STATS = 'stats',
    TRANSFER_LOGS = 'transfer logs',
    TRANSFER_STATUS = 'transfer status',
    BACKUP_COMPLETED = 'backup completed',
    BACKUP_RESTORE_COMPLETED = 'backup restore completed',
    ERROR = "error",
    TOKEN_EXPIRING = "token expiring",
    TOKEN_EXPIRED = "token expired"
}

export type InstallOutputEvent = {
    event: SocketEvent.INSTALL_OUTPUT;
    args: [string];
};

export type InstallStartedEvent = {
    event: SocketEvent.INSTALL_STARTED;
};

export type InstallCompletedEvent = {
    event: SocketEvent.INSTALL_COMPLETED;
};

export type TransferLogsEvent = {
    event: SocketEvent.TRANSFER_LOGS;
    args: [string];
};

export type TransferStatusEvent = {
    event: SocketEvent.TRANSFER_STATUS;
    args: [string];
};

export type BackupCompletedEvent = {
    event: SocketEvent.BACKUP_COMPLETED;
    args: [string]
};

export type BackupCompletedJson = {
    checksum: string
    checksum_type: "sha1", 
    file_size: number, 
    is_successful: boolean, 
    uuid: string
}

export type BackupRestoreCompletedEvent = {
    event: SocketEvent.BACKUP_RESTORE_COMPLETED;
};

export type AuthSuccessWsEvent = {
    event: SocketEvent.AUTH_SUCCESS;
};

export type StatusWsEvent = { event: SocketEvent.STATUS; args: [PowerState] };

export type PowerState = "starting" | "stopping" | "online" | "offline";

export type ConsoleLogWsEvent = {
    event: SocketEvent.CONSOLE_OUTPUT;
    args: [string];
};

export type StatsWsEvent = {
    event: SocketEvent.STATS;
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

export type TokenExpiringWsEvent = { event: SocketEvent.TOKEN_EXPIRING };

export type TokenExpiredWsEvent = { event: SocketEvent.TOKEN_EXPIRED };

/**
 * Example:
 * {"event":"daemon message","args":["(restoring): file1.yml"]}
 * {"event":"daemon message","args":["(restoring): file2"]}
 * {"event":"daemon message","args":["(restoring): file3.jar"]}
 * {"event":"daemon message","args":["(restoring): file5.tar.gz"]}
 * {"event":"daemon message","args":["Completed server restoration from local backup."]}
 */
export type DaemonMessageEvent = { 
    event: SocketEvent.DAEMON_MESSAGE, args: [string] 
}

export type DaemonErrorEvent = { event: SocketEvent.DAEMON_ERROR, args: [string] }