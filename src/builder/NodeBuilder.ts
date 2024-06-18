import { PanelLocation } from "../ApplicationClient/PanelLocation"

export class NodeBuilder {

    private name: string
    private description?: string
    private location_id: number
    private public: number = 1
    private fqdn: string
    private scheme: "https" | "http" = "https"
    private behind_proxy: number = 0
    private daemonBase: string = "/var/lib/pterodactyl/volumes"
    private memory: number
    private memory_overallocate: number = 0
    private disk: number
    private disk_overallocate: number = 0
    private daemon_listen: number = 8080
    private daemon_sftp: number = 2022

    constructor() {
        this.name = ""
        this.location_id = 0
        this.fqdn = ""
        this.memory = 0
        this.disk = 0
    }

    /**
     * Set the name for this node
     * @required
     */
    public setName(name: string): NodeBuilder {
        this.name = name
        return this
    }

    /**
     * Set the description for this node
     */
    public setDescription(description: string): NodeBuilder {
        this.description = description
        return this
    }

    /**
     * Set the location id for this node
     * @required
     */
    public setLocationId(locationId: number): NodeBuilder {
        this.location_id = locationId
        return this
    }

    /**
     * Set the location by PanelLocation
     * @required
     */

    public setLocation(location: PanelLocation): NodeBuilder {
        this.location_id = location.id
        return this
    }

    /**
     * Set the public status for this node
     * @required
     */
    public setPublic(publicNode: boolean): NodeBuilder {
        this.public = publicNode ? 1 : 0
        return this
    }

    /**
     * Set the fqdn for this node
     * Should be a domain or ip-address
     * @required
     */
    public setFqdn(fqdn: string): NodeBuilder {
        this.fqdn = fqdn
        return this
    }

    /**
     * Set the scheme for this node
     * If you use an ip-address you can only use http
     * @required
     */
    public setScheme(scheme: "https" | "http"): NodeBuilder {
        this.scheme = scheme
        return this
    }

    /**
     * Set the behind proxy for this node
     * @required
     */
    public setBehindProxy(behindProxy: boolean): NodeBuilder {
        this.behind_proxy = behindProxy ? 1 : 0
        return this
    }

    /**
     * Set the daemon base for this node
     * @default daemonBase /var/lib/pterodactyl/volumes
     * @optional
     */
    public setDaemonBase(daemonBase: string): NodeBuilder {
        this.daemonBase = daemonBase
        return this
    }

    /**
     * Set the memory for this node (in MiB)
     * @required
     */
    public setMemory(memory: number): NodeBuilder {
        this.memory = memory
        return this
    }

    /**
     * Set the memory overallocate for this node (in %)
     * Use -1 to disable overallocation check
     * Use 0 to prevent new servers if memory limit is reached
     * @default memoryOverallocate 0
     * @required
     */
    public setMemoryOverallocate(memoryOverallocate: -1 | 0 | number): NodeBuilder {
        this.memory_overallocate = memoryOverallocate
        return this
    }

    /**
     * Set the disk for this node (in MiB)
     * @required
     */
    public setDisk(disk: number): NodeBuilder {
        this.disk = disk
        return this
    }

    /**
     * Set the disk overallocate for this node (in %)
     * Use -1 to disable overallocation check
     * Use 0 to prevent new servers if disk limit is reached
     * @default diskOverallocate 0
     * @optional
     */
    public setDiskOverallocate(diskOverallocate: number): NodeBuilder {
        this.disk_overallocate = diskOverallocate
        return this
    }

    /**
     * Set the daemon port
     * @default daemonPort 8080
     * @optional
     */
    public setDaemonPort(daemonPort: number): NodeBuilder {
        this.daemon_listen = daemonPort
        return this
    }

    /**
     * Set the daemon sftp port
     * @default daemon_sftpPort 2022
     * @optional
     */
    public setDaemonSftp(daemon_sftpPort: number): NodeBuilder {
        this.daemon_sftp = daemon_sftpPort
        return this
    }

}