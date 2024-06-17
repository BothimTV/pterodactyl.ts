import { Egg } from "../ApplicationClient/Egg"
import { NodeAllocation } from "../ApplicationClient/NodeAllocation"
import { User } from "../ApplicationClient/User"

export class ServerBuilder {

    private name: string
    private user: number
    private description?: string
    private start_on_completion: "on" | undefined

    private node_id?: number // @deprecated Is only used for frontend 

    private allocation: {
        default: number
        additional: { [i: number]: number }
    }

    private feature_limits: {
        databases: number
        allocations: number
        backups: number
    }

    private limits: {
        cpu: number
        threads: string | undefined
        memory: number
        swap: number
        disk: number
        io: number
    }
    private oom_disabled: 0 | undefined

    private nest_id?: number // @deprecated Is only used for frontend 
    private egg: number
    private skip_scripts: 1 | undefined

    private docker_image: string
    private custom_image?: string
    private startup: string
    private environment: { [environment: string]: string } = {}

    constructor() {
        this.feature_limits = {
            databases: 0,
            allocations: 0,
            backups: 0
        }
        this.start_on_completion = "on"
        this.limits = {
            cpu: 0,
            threads: '',
            memory: 0,
            swap: 0,
            disk: 0,
            io: 500
        }
        this.allocation = {
            default: 0,
            additional: {}
        }
        this.name = ''
        this.user = 0
        this.node_id = 0
        this.egg = 0
        this.docker_image = ''
        this.startup = ''
    }

    /**
     * @param name The name for this server
     */
    public setName(name: string): ServerBuilder {
        this.name = name
        return this
    }

    /**
     * @optional @param description Set the description for this server
     */
    public setDescription(description: string): ServerBuilder {
        this.description = description
        return this
    }

    /**
     * @param user The user that will own this server
     */
    public setOwner(user: User): ServerBuilder {
        this.user = user.id
        return this
    }

    /**
    * @param user The user's id that will own this server
    */
    public setOwnerId(user: number): ServerBuilder {
        this.user = user
        return this
    }

    /**
     * Should the server autostart when the server is done with the install process
     * @optional 
     * @default start true
     */
    public startServerWhenInstalled(start: boolean): ServerBuilder {
        this.start_on_completion = start ? 'on' : undefined
        return this
    }

    /**
     * Set the node for this server  
     * @optional
     * @deprecated You'll set the node by the allocation (id)
     */
    public setNodeId(node_id: number): ServerBuilder {
        this.node_id = node_id
        return this
    }

    /**
     * The default allocation for this server 
     * @param allocation The allocation you want to assign
     */
    public setAllocation(allocation: NodeAllocation): ServerBuilder {
        this.allocation.default = allocation.id
        return this
    }

    /**
    * The default allocation for this server 
    * @param allocation_id The allocation id you want to assign
    */
    public setAllocationId(allocation_id: number): ServerBuilder {
        this.allocation.default = allocation_id
        return this
    }

    /**
     * Add additional allocations to this server
     * @optional
     */
    public setAdditionalAllocations(allocations: Array<NodeAllocation>): ServerBuilder {
        this.allocation.additional = {}
        allocations.map(allocation => this.allocation.additional[allocation.id] = allocation.id)
        return this
    }

    /**
     * Add additional allocation ids to this server
     * @optional
     */
    public setAdditionalAllocationIds(allocationIds: Array<number>): ServerBuilder {
        this.allocation.additional = {}
        allocationIds.map(id => this.allocation.additional[id] = id)
        return this
    }

    /**
     * Add a allocation id to this server
     * @optional
     */
    public addAdditionalAllocationId(id: number): ServerBuilder {
        this.allocation.additional[id] = id
        return this
    }

    /**
     * Add a allocation id to this server
     * @optional
     */
    public addAdditionalAllocation(allocation: NodeAllocation): ServerBuilder {
        this.allocation.additional[allocation.id] = allocation.id
        return this
    }

    /**
     * Set how many databases can be created for this server
     * @default 0
     */
    public setDatabaseLimit(maxDatabases: number): ServerBuilder {
        this.feature_limits.databases = maxDatabases
        return this
    }

    /**
     * Set how many allocations can be created for this server
     * @default 0
     */
    public setAllocationLimit(maxAllocations: number): ServerBuilder {
        this.feature_limits.allocations = maxAllocations
        return this
    }

    /**
     * Set how many backups can be created for this server
     * @default 0
     */
    public setBackupLimit(maxBackups: number): ServerBuilder {
        this.feature_limits.backups = maxBackups
        return this
    }

    /**
     * Set the maximum cpu usage for this server  
     * Set this to 0 for no cpu limit  
     * ------------------------  
     * If you have 4 cores and want to allow to use all of them you'll need to use 400  
     * Example: 4 * 100 = 400 | Cores * 100 = Max for this node  
     * ------------------------  
     * @param cpuLimit in %
     * @default 0
     */
    public setCpuLimit(cpuLimit: number): ServerBuilder {
        this.limits.cpu = cpuLimit
        return this
    }

    /**
     * Set which cores can be used by a server  
     * Example: 0; 1-3; 4,5,6;
     * @optional
     * @default undefined
     */
    public setCpuPinning(pinning: Array<number | string> | string): ServerBuilder {
        this.limits.threads = typeof pinning === 'string' ? pinning : pinning.join(',')
        return this
    }

    /**
     * Set the memory limit for this server  
     * @param memoryLimit in MiB
     * @default 0
     */
    public setMemoryLimit(memoryLimit: number): ServerBuilder {
        this.limits.memory = memoryLimit
        return this
    }

    /**
     * Set the swap limit for this server  
     * @param swapLimit in MiB
     * @default 0
     */
    public setSwapLimit(swapLimit: number): ServerBuilder {
        this.limits.swap = swapLimit
        return this
    }

    /**
     * Set the disk limit for this server  
     * @param diskLimit in MiB
     * @default 0
     */
    public setDiskLimit(diskLimit: number): ServerBuilder {
        this.limits.disk = diskLimit
        return this
    }

    /**
     * [ADVANCED]  
     * Set the io limit for this server  
     * Documentation: https://docs.docker.com/engine/reference/run/#block-io-bandwidth-blkio-constraint  
     * @param ioLimit between 10 and 1000
     * @default 0
     */
    public setIoLimit(ioLimit: number): ServerBuilder {
        this.limits.io = ioLimit
        return this
    }

    /**
     * Enable the OOM killer  
     * This will kill the server if it exceeds the memory limit  
     * This may cause the server processes to exit unexpectedly  
     * This CAN cause to data corruption
     * @default false 
     */
    public enableOOM(enabled: boolean): ServerBuilder {
        this.oom_disabled = enabled ? 0 : undefined
        return this
    }

    /**
     * Set the nest id for this server
     * @deprecated This will be set by the egg (id)
     */
    public setNestId(nest_id: number): ServerBuilder {
        this.nest_id = nest_id
        return this
    }

    /**
     * Set the egg for this server  
     * When not set as id this will also set the docker image, the startup command and the variables to their default values
     * @param egg The egg id or the egg as object 
     */
    public setEgg(egg: number | Egg): ServerBuilder {
        this.egg = typeof egg == "number" ? egg : egg.id
        if (typeof egg != "number") {
            this.docker_image = egg.docker_image
            this.startup = egg.startup
            egg.associatedVariables?.forEach(variable => {
                this.environment[variable.name] = variable.default_value
            })
        }
        return this
    }

    /**
     * Manually set the egg id
     */
    public setEggId(egg: number): ServerBuilder {
        this.egg = egg
        return this
    }

    /**
     * Should the server skip the install process  
     * Using this will likely prevent the server from starting after the creation   
     * @default false
     */
    public setSkipInstall(skip: boolean): ServerBuilder {
        this.skip_scripts = skip ? 1 : undefined
        return this
    }

    /**
     * Set the docker image to in which the server will start
     * @default image This will use the default image if you set the egg via .setEgg(egg: PanelEgg)
     */
    public setDockerImage(image: string): ServerBuilder {
        this.docker_image = image
        return this
    }

    /**
     * Set a custom docker image
     * @default custom_image undefined
     */
    public setCustomImage(custom_image: string): ServerBuilder {
        this.custom_image = custom_image
        return this
    }

    /**
     * Set the startup command with which the server will start  
     * This can include environment vars via {{ VAR_NAME }}
     * @default startup This will use the default startup command if you set the egg via .setEgg(egg: PanelEgg)
     */
    public setStartup(startup: string): ServerBuilder {
        this.startup = startup
        return this
    }

    /**
     * Set the environment vars with which the server will start
     * @default environment This will use the default environment if you set the egg via .setEgg(egg: PanelEgg)
     */
    public setEnvironment(environment: { [environment: string]: string }): ServerBuilder {
        this.environment = environment
        return this
    }

    /**
     * Add environment vars with which the server will start
     * @default environment This will use the default environment if you set the egg via .setEgg(egg: PanelEgg)
     */
    public addEnvironmentVariable(key: string, value: string): ServerBuilder {
        this.environment[key] = value
        return this
    }

}