export class ServerDatabaseBuilder {
    private database: string;
    private remote: string = "%";
    private host: number; // TODO: Check if this is required!

    constructor() {
        this.database = "";
        this.host = 0;
    }

    public setName(name: string): ServerDatabaseBuilder {
        this.database = name;
        return this;
    }

    public setAllowedRemote(remote: string): ServerDatabaseBuilder {
        this.remote = remote;
        return this;
    }

    public setHost(host: number): ServerDatabaseBuilder {
        this.host = host;
        return this;
    }

}