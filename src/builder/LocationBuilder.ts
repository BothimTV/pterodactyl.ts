export class LocationBuilder {
  private short: string;
  private long?: string;

  constructor() {
    this.short = '';
  }

  public setShort(short: string) {
    this.short = short;
    return this;
  }

  public setDescription(long: string) {
    this.long = long;
    return this;
  }
}
