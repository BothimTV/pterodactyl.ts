import { EventEmitter } from 'events';
import stripColor from "strip-color";
import WebSocket from 'ws';
import { ServerSignalOption } from '../types/base/serverStatus';
import { BackupCompletedEvent, BackupCompletedJson, ConsoleLogWsEvent, PowerState, SocketEvent, StatsWsEvent, StatsWsJson, StatusWsEvent, WebsocketEvent } from '../types/user/consoleSocket';
import { Server } from './Server';
import { UserClient } from './UserClient';

// file deepcode ignore InsufficientPostmessageValidation 

let client: UserClient
export class ServerConsoleConnection {

    private endpoint: string

    private socket?: WebSocket
    private currentKey?: string
    private debugLogging? = false
    private eventEmitter = new EventEmitter()
    private prettyLogs = true

    public on(eventName: SocketEvent, listener: (arg?: PowerState | string | StatsWsJson | BackupCompletedJson) => void) {
        this.eventEmitter.on(eventName, listener)
    }

    private emit(eventName: SocketEvent, payload?: PowerState | string | StatsWsJson | BackupCompletedJson) {
        this.eventEmitter.emit(eventName, payload)
    }

    constructor(server: Server, userClient: UserClient, prettyLogs: boolean) {
        this.endpoint = userClient.panel + "/api/client/servers/" + server.identifier + "/websocket"
        client = userClient
        this.prettyLogs = prettyLogs
    }

    /**
     * Connect to a servers console.
     * You can then listen on the 
     * @param debugLogging Debug enabled?
     */
    public async connect(debugLogging?: boolean): Promise<void> {
        this.debugLogging = debugLogging
        if (!this.socket) {
            this.socket = new WebSocket(await this.setKey(), {
                origin: new URL(this.endpoint).origin
            })
            if (!this.socket) throw new Error("Failed to create socket connection")
            return await new Promise(resolve => {
                if (!this.socket) throw new Error("No socket connection")
                this.socket.onopen = async () => {
                    await this.authSocket()
                    this.addListen()
                    resolve()
                };
            })
        }
    }

    private addListen() {
        if (!this.socket) return console.error(new Error("No socket connection"))
        this.socket.addEventListener("message", (ev) => {
            this.listen(JSON.parse(ev.data as string) as WebsocketEvent)
        })
    }

    private async setKey(): Promise<string> {
        const res = await client.api({ url: this.endpoint }) as { data: { token: string, socket: string } }
        this.currentKey = res.data.token
        return res.data.socket
    }

    private async authSocket() {
        if (!this.socket) return console.error(new Error("No socket connection"))
        this.socket.send(
            JSON.stringify({ event: "auth", args: [this.currentKey] })
        );
    }

    private async listen(data: WebsocketEvent) {
        switch (data.event) {
            case SocketEvent.AUTH_SUCCESS: {
                if (this.debugLogging) console.debug("Auth success")
                this.emit(SocketEvent.AUTH_SUCCESS)
                break;
            }
            case SocketEvent.STATUS: {
                if (this.debugLogging) console.debug("Received status event: " + data.args)
                this.emit(SocketEvent.STATUS, (data as StatusWsEvent).args[0])
                break;
            }
            case SocketEvent.CONSOLE_OUTPUT: {
                if (this.debugLogging) console.debug("Received console output event: " + data.args);
                var res = (data as ConsoleLogWsEvent).args[0]
                if (this.prettyLogs) res = stripColor(res)
                this.emit(SocketEvent.CONSOLE_OUTPUT, res)
                break;
            }
            case SocketEvent.STATS: {
                this.emit(SocketEvent.STATS, JSON.parse((data as StatsWsEvent).args[0]) as StatsWsJson)
                break;
            }
            case SocketEvent.DAEMON_ERROR: {
                this.emit(SocketEvent.ERROR)
                break;
            }
            case SocketEvent.BACKUP_COMPLETED: {
                this.emit(SocketEvent.BACKUP_COMPLETED, JSON.parse((data as BackupCompletedEvent).args[0]) as BackupCompletedJson)
                break
            }
            case SocketEvent.DAEMON_MESSAGE: {
                this.emit(SocketEvent.DAEMON_MESSAGE)
                break
            }
            case SocketEvent.INSTALL_OUTPUT: {
                this.emit(SocketEvent.INSTALL_OUTPUT)
                break
            }
            case SocketEvent.BACKUP_RESTORE_COMPLETED: {
                this.emit(SocketEvent.BACKUP_RESTORE_COMPLETED)
                break
            }
            case SocketEvent.INSTALL_COMPLETED: {
                this.emit(SocketEvent.INSTALL_COMPLETED)
                break
            }
            case SocketEvent.INSTALL_STARTED: {
                this.emit(SocketEvent.INSTALL_STARTED)
                break
            }
            case SocketEvent.TRANSFER_LOGS: {
                this.emit(SocketEvent.TRANSFER_LOGS, data.args[0])
                break
            }
            case SocketEvent.TRANSFER_STATUS: {
                this.emit(SocketEvent.TRANSFER_STATUS, data.args[0])
                break
            }
            case SocketEvent.TOKEN_EXPIRING: {
                this.emit(SocketEvent.TOKEN_EXPIRING)
                if (this.debugLogging) console.warn("Token expiring, renewing...")
                await this.setKey()
                await this.authSocket()
                break;
            }
            case SocketEvent.TOKEN_EXPIRED: {
                this.emit(SocketEvent.TOKEN_EXPIRED)
                throw new Error("Token expired")
            }
            default: {
                console.error(`Unknown event: ${JSON.stringify(data)}`)
                break
            }
        }
    }

    /**
     * Disconnect from the server.
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.close()
            this.socket = undefined
        }
    }

    /**
     * Request the stats of this server
     */
    public requestStats(): void {
        this.socket?.send(JSON.stringify({ event: "send stats", args: [null] }));
    }

    /**
     * Request the logs of this server
     */
    public requestLogs(): void {
        this.socket?.send(JSON.stringify({ event: "send logs", args: [null] }));
    }

    /**
     * Get the stats of this server
     */
    public getStats(): Promise<StatsWsJson> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject("No socket connection")
            } else {
                const collect = (ev: any) => {
                    this.requestStats();
                    const data = (JSON.parse(ev.data as string) as WebsocketEvent)
                    if (data.event == "stats") {
                        if (!this.socket) return reject("No socket connection")
                        this.socket.removeEventListener("message", collect)
                        return resolve(JSON.parse((data as StatsWsEvent).args[0]) as StatsWsJson)
                    }
                }
                this.socket.addEventListener("message", collect)
            }
        })
    }

    /**
     * Get the logs of this server
     */
    public getLogs(): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject("No socket connection")
            } else {
                const res: Array<string> = []
                var submitTimeout: NodeJS.Timeout = setTimeout(() => {
                    resolve(["No logs - is the server online?"])
                }, 5000)
                const collect = async (ev: any) => {
                    await this.getLogs();
                    const data = (JSON.parse(ev.data as string) as WebsocketEvent)
                    if (data.event == "console output") {
                        res.push(data.args[0])
                        clearTimeout(submitTimeout)
                        submitTimeout = setTimeout(() => {
                            if (!this.socket) return reject("No socket connection")
                            this.socket.removeEventListener("message", collect)
                            resolve(res)
                        }, 1000)
                    }
                }
                this.socket.addEventListener("message", collect)
            }
        })
    }

    /**
     * Send a power action to this server
     */
    public sendPoweraction(action: ServerSignalOption): void {
        this.socket?.send(JSON.stringify({ event: "set state", args: [action] }));
    }

    /**
     * Send a command to this server
     */
    public sendCommand(cmd: string): void {
        this.socket?.send(JSON.stringify({ event: "send command", args: [cmd] }));
    }

}