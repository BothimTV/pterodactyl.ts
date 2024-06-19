import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { ServerSignalOption } from '../types/base/serverStatus';
import { ConsoleLogWsEvent, PowerState, StatsWsEvent, StatsWsJson, StatusWsEvent, WebsocketEvent } from '../types/user/consoleSocket';
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

    public on(eventName: "auth_success" | "status" | "console_output" | "stats", listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener)
    }

    private emit(eventName: "auth_success" | "status" | "console_output" | "stats", payload: undefined | PowerState | string | StatsWsJson) {
        this.eventEmitter.emit(eventName, payload)
    }

    constructor(server: Server, userClient: UserClient) {
        this.endpoint = userClient.panel + "/api/client/servers/" + server.identifier + "/websocket"
        client = userClient
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
            this.socket.onopen = async () => {
                await this.authSocket()
            };
            this.socket.addEventListener("message", (ev) => {
                this.listen(JSON.parse(ev.data as string) as WebsocketEvent)
            })
        }
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
            case 'auth success': {
                if (this.debugLogging) console.debug("Auth success")
                this.emit("auth_success", undefined)
                break;
            }
            case 'status': {
                if (this.debugLogging) console.debug("Received status event: " + data.args)
                this.emit("status", (data as StatusWsEvent).args[0])
                break;
            }
            case 'console output': {
                if (this.debugLogging) console.debug("Received console output event: " + data.args)
                this.emit("console_output", (data as ConsoleLogWsEvent).args[0])
                break;
            }
            case 'stats': {
                this.emit("stats", JSON.parse((data as StatsWsEvent).args[0]) as StatsWsJson)
                break;
            }
            case 'token expiring': {
                if (this.debugLogging) console.warn("Token expiring, renewing...")
                await this.setKey()
                await this.authSocket()
                break;
            }
            case 'token expired': {
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