import { readFileSync } from "fs";
import { DatabaseBuilder } from "../builder/DatabaseBuilder";
import { RawServerSubUserList } from "../types/application/serverSubUser";
import { ServerSignal, ServerStatus } from "../types/base/serverStatus";
import { RawSignedUrl } from "../types/base/signedUrl";
import { RawAllocationList } from "../types/user/allocation";
import { RawEgg } from "../types/user/egg";
import { RawEggVariableList } from "../types/user/eggVariable";
import { RawFileList } from "../types/user/file";
import { RawServer, ServerAttributes } from "../types/user/server";
import { RawServerDatabase, RawServerDatabaseList } from "../types/user/serverDatabase";
import { RawStats, StatsAttributes } from "../types/user/stats";
import { Database } from "./Database";
import { File } from "./File";
import { ServerConsoleConnection } from "./ServerConsoleConnection";
import { UserClient } from "./UserClient";

let client: UserClient
export class Server implements ServerAttributes {
    readonly server_owner: boolean;
    readonly identifier: string;
    readonly internal_id: string | number;
    readonly uuid: string;
    name: string;
    readonly node: string;
    readonly is_node_under_maintenance: boolean;
    readonly sftp_details: {
        readonly ip: string;
        readonly port: number;
    };
    description: string;
    readonly limits: {
        readonly memory: number;
        readonly swap: number;
        readonly disk: number;
        readonly io: number;
        readonly cpu: number;
        readonly threads?: string | null;
        readonly oom_disabled: boolean;
    };
    readonly invocation: string;
    docker_image: string;
    readonly egg_features: Array<string>;
    readonly feature_limits: {
        readonly databases: number;
        readonly allocations: number;
        readonly backups: number;
    };
    status: ServerStatus | null;
    readonly is_suspended: boolean;
    readonly is_installing: boolean;
    readonly is_transferring: boolean;
    readonly relationships?: {
        readonly allocations?: RawAllocationList;
        readonly variable?: RawEggVariableList;
        readonly egg?: RawEgg;
        readonly subusers?: RawServerSubUserList;
    };

    constructor(userClient: UserClient, server: RawServer) {
        client = userClient
        this.server_owner = server.attributes.server_owner;
        this.identifier = server.attributes.identifier;
        this.internal_id = server.attributes.internal_id;
        this.uuid = server.attributes.uuid;
        this.name = server.attributes.name;
        this.node = server.attributes.node;
        this.is_node_under_maintenance = server.attributes.is_node_under_maintenance;
        this.sftp_details = server.attributes.sftp_details;
        this.description = server.attributes.description;
        this.limits = server.attributes.limits;
        this.invocation = server.attributes.invocation;
        this.docker_image = server.attributes.docker_image;
        this.egg_features = server.attributes.egg_features;
        this.feature_limits = server.attributes.feature_limits;
        this.status = server.attributes.status;
        this.is_suspended = server.attributes.is_suspended;
        this.is_installing = server.attributes.is_installing;
        this.is_transferring = server.attributes.is_transferring;
        this.relationships = server.attributes.relationships;
    }

    /**
     * Get a console socket
     */
    public async getConsoleSocket(debugLogging: boolean = false): Promise<ServerConsoleConnection> {
        const socket = new ServerConsoleConnection(this, client)
        await socket.connect(debugLogging)
        return socket
    }

    /**
     * Get the server resource usage
     */
    public async getUsage(): Promise<StatsAttributes> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/resources");
        return (await client.api({ url: endpoint.href }) as RawStats).attributes;
    }

    /**
     * Send a console command to this server
     */
    public async sendCommand(command: string): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/command");
        await client.api({ url: endpoint.href, method: "POST", data: { command: command } });
    }

    /**
     * Start this server
     */
    public async start(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/power");
        await client.api({ url: endpoint.href, method: "POST", data: { signal: ServerSignal.START } });
    }

    /**
     * Stop this server
     */
    public async stop(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/power");
        await client.api({ url: endpoint.href, method: "POST", data: { signal: ServerSignal.STOP } });
    }
    
    /**
     * Restart this server
     */
    public async restart(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/power");
        await client.api({ url: endpoint.href, method: "POST", data: { signal: ServerSignal.RESTART } });
    }

    /**
     * Kill this server  
     * WARNING: This might cause data loss!
     */
    public async kill(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/power");
        await client.api({ url: endpoint.href, method: "POST", data: { signal: ServerSignal.KILL } });
    }
    
    /**
     * Get the databases of this server
     */
    public async getDatabases(): Promise<Array<Database>> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/databases?include=password");
        return (await client.api({ url: endpoint.href }) as RawServerDatabaseList).data.map(database => new Database(client, database, this));
    }

    /**
     * Create a databases for this server
     */
    public async createDatabases(builder: DatabaseBuilder): Promise<Database> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/databases");
        return new Database(client, (await client.api({ url: endpoint.href, method: "POST", data: builder }) as RawServerDatabase), this);
    }

    /**
     * Gets the files of a specific directory
     */
    public async getFiles(dir: string = "/"): Promise<Array<File>> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/list?directory=" + encodeURIComponent(dir));
        return (await client.api({ url: endpoint.href }) as RawFileList).data.map(file => new File(client, file, this, dir));
    }

    /**
     * Rename files in a specific directory
     */
    public async renameFiles(dir: string, files: Array<{from: string | File, to: string}>): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/rename");
        const targets = files.map(file => {
            return { from: typeof file.from === "string" ? file.from : file.from.name, to: file.to }
        })
        await client.api({ url: endpoint.href, method: 'PUT', data: { root: dir, files: targets } })
    }

    /**
     * Compress files in a specific directory
     */
    public async compressFiles(dir: string, files: Array<string | File>): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/compress");
        const targets = files.map(file => typeof file === "string" ? file : file.name)
        await client.api({ url: endpoint.href, method: 'POST', data: { root: dir, files: targets } })
    }

    /**
     * Decompress a archive
     */
    public async decompressFile(dir: string, file: string | File): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/decompress");
        await client.api({ url: endpoint.href, method: 'POST', data: { root: dir, file: typeof file === "string" ? file : file.name } })
    }

    /**
     * Delete files in a specific directory
     */
    public async deleteFiles(dir: string, files: Array<string | File>): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/delete");
        const targets = files.map(file => typeof file === "string" ? file : file.name)
        await client.api({ url: endpoint.href, method: 'POST', data: { root: dir, files: targets } })
    }

    /**
     * Create a folder in a specific directory
     */
    public async createFolder(dir: string, folderName: string): Promise<void>  {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/create-folder");
        await client.api({ url: endpoint.href, method: 'POST', data: { root: dir, name: folderName } })
    }

    /**
     * Get a upload url to upload files
     */
    public async uploadUrl(): Promise<URL> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.identifier + "/files/upload");
        return new URL((await client.api({ url: endpoint.href, method: 'GET' }) as RawSignedUrl).attributes.url)
    }

    /**
     * Upload a file
     * @file A buffer, blob or the path to the file
     */
    public async uploadFile(dir: string = "/", file: Blob | Buffer | string, filename: string): Promise<void> {
        const uploadUrl = await this.uploadUrl()
        uploadUrl.searchParams.append("directory", dir)
        await client.api({ url: uploadUrl.href, method: 'OPTIONS' })
        let blob
        if (file instanceof Blob) blob = file
        else if (file instanceof Buffer) blob = new Blob([file])
        else blob = new Blob([readFileSync(file)])
        const formData = new FormData()
        formData.append("files", blob, filename)
        await client.api({ url: uploadUrl.href, method: 'POST', data: formData })
    }

}