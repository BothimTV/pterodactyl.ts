export class ServerDatabaseBuilder {
    private database: string;
    private remote: string = "%";

    constructor() {
        this.database = "";
    }

    /**
     * Set the name for this database
     */
    public setName(name: string): ServerDatabaseBuilder {
        this.database = name;
        return this;
    }

    /**
     * Define which ip addresses will be allowed to connect to your database.
     * @default remote % (every)
     */
    public setAllowedRemote(remote: string): ServerDatabaseBuilder {
        this.remote = remote;
        return this;
    }

}