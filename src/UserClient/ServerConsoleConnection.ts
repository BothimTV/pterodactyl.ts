import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { BaseClient } from '../BaseClient/BaseClient';
import { ConsoleLogWsEvent, StatsWsEvent, StatsWsJson, StatusWsEvent, WebsocketEvent } from '../types/consoleSocket';

// file deepcode ignore InsufficientPostmessageValidation 

var client: BaseClient
export class ServerConsoleConnection extends EventEmitter {

    private endpoint: string

    private socket?: WebSocket
    private currentKey?: string
    private debugLogging? = false

    constructor(endpoint: string, c: BaseClient) {
        super()
        this.endpoint = endpoint
        client = c
    }

    /**
     * Connect to a servers console.
     * You can then listen on the 
     * @param debugLogging Debug enabled?
     */
    public async connect(debugLogging?: boolean) {
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
        this.currentKey = res.data.socket
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
                this.emit("auth_success")
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
                console.error(`Unknown event: ${data}`)
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

    public requestStats(): void {
        this.socket?.send(JSON.stringify({ event: "send stats", args: [null] }));
    }

    public requestLogs(): void {
        this.socket?.send(JSON.stringify({ event: "send logs", args: [null] }));
    }

    public getStats(): Promise<StatsWsJson> { // TODO: Check if this event is received when the server is offline - prevent getting stuck!
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject("No socket connection")
            } else {
                this.socket.addEventListener("message", async (ev) => {
                    await this.requestStats();
                    const data = (JSON.parse(ev.data as string) as WebsocketEvent)
                    if (data.event == "stats") {
                        return resolve(JSON.parse((data as StatsWsEvent).args[0]) as StatsWsJson)
                    }
                })
            }
        })
    }

    public getLogs(): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject("No socket connection")
            } else {
                const res: Array<string> = []
                var submitTimeout: NodeJS.Timeout = setTimeout(() => {
                    resolve(["No logs - is the server online?"])
                }, 5000)
                this.socket.addEventListener("message", async (ev) => {
                    await this.getLogs();
                    const data = (JSON.parse(ev.data as string) as WebsocketEvent)
                    if (data.event == "console output") {
                        res.push(data.args[0])
                        clearTimeout(submitTimeout)
                        submitTimeout = setTimeout(() => {
                            resolve(res)
                        }, 1000)
                    }
                })
            }
        })
    }

    public sendPoweraction(action: string): void {
        this.socket?.send(JSON.stringify({ event: "set state", args: [action] }));
    }

    public sendCommand(cmd: string): void {
        this.socket?.send(JSON.stringify({ event: "send command", args: [cmd] }));
    }


}