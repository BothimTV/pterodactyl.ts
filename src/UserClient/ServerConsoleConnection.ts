import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { ApplicationClient } from '../ApplicationClient/ApplicationClient';
import { WebsocketEvent } from '../types/consoleSocket';
import { UserClient } from './UserClient';

var client: ApplicationClient | UserClient
export class ServerConsoleConnection extends EventEmitter {

    private endpoint: string
    private apiKey: string

    private socket?: WebSocket
    private currentKey?: string

    constructor(endpoint: string, apiKey: string, c: ApplicationClient | UserClient) {
        super()
        this.endpoint = endpoint
        this.apiKey = apiKey
        client = c
    }

    public async connect() {
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
                console.debug("Auth success")
                this.emit("auth_success")
                break;
            }
            case 'status': {
                this.emit("status", data.args)
                break;
            }
            case 'console output': {
                this.emit("console_output", data.args)
                break;
            }
            case 'stats': {
                this.emit("stats", data.args)
                break;
            }
            case 'token expiring': {
                console.warn("Token expiring, renewing...")
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

    public async disconnect() {
        if (this.socket) {
            this.socket.close()
            this.socket = undefined
        }
    }


}