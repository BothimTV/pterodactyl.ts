export class DatabaseBuilder {
  private database: string;
  private remote: string = '%';

  constructor() {
    this.database = '';
  }

  /**
   * Set the name for this database
   */
  public setName(name: string): DatabaseBuilder {
    this.database = name;
    return this;
  }

  /**
   * Define which ip addresses will be allowed to connect to your database.
   * @default remote % (every)
   */
  public setAllowedRemote(remote: string): DatabaseBuilder {
    this.remote = remote;
    return this;
  }
}
