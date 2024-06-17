export class ServerDatabaseBuilder {
    private database: string;
    private remote: string = "%";

    constructor() {
        this.database = "";
    }

    public setName(name: string): ServerDatabaseBuilder {
        this.database = name;
        return this;
    }

    public setAllowedRemote(remote: string): ServerDatabaseBuilder {
        this.remote = remote;
        return this;
    }

}