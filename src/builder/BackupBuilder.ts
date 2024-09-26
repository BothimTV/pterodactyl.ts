var ignoredArr: Array<string> = [];
export class BackupBuilder {
  name: string;
  ignored: string = "";
  is_locked: boolean = false;

  constructor() {
    this.name = "";
  }

  /**
   * Sets the name of the backup.
   * @param name The name of the backup.
   */
  public setName(name: string): BackupBuilder {
    this.name = name;
    return this;
  }

  /**
   * Sets the ignored files or directories for the backup.
   * @param ignored An array of strings or a single string representing the ignored files or directories.
   */
  public setIgnored(ignored: Array<string> | string): BackupBuilder {
    if (typeof ignored === "string") {
      ignoredArr = [ignored];
    } else {
      ignoredArr.push(...ignored);
    }
    this.ignored = ignoredArr.join(", ");
    return this;
  }

  /**
   * Adds a file or directory to the ignored list for the backup.
   * @param ignored The file or directory to ignore.
   */
  public addIgnored(ignored: string): BackupBuilder {
    ignoredArr.push(ignored);
    this.ignored = ignoredArr.join(", ");
    return this;
  }

  /**
   * Sets whether the backup is locked.
   * @param is_locked Whether the backup is locked.
   */
  public setLocked(is_locked: boolean): BackupBuilder {
    this.is_locked = is_locked;
    return this;
  }
}
