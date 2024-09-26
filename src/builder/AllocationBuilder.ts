export class AllocationBuilder {
  private ip: string;
  private ports: Array<string>;
  private alias?: string = '';

  constructor() {
    this.ip = '';
    this.ports = [];
  }

  /**
   * Set the ip address for this allocation
   * @argument ip Ip address to bind on
   */
  public setIp(ip: string): AllocationBuilder {
    this.ip = ip;
    return this;
  }

  /**
   * Add a port to this allocation
   * @argument port Port to bind on | Range: 1024 <= 65535
   */
  public addPort(port: number | string): AllocationBuilder {
    this.ports.push(port.toString());
    return this;
  }

  /**
   * Add ports to this allocation
   * You can use 25565-25570 as range
   * @argument ports Ports to bin on | Range: 1024 <= 65535
   */
  public addPorts(ports: Array<number | string>): AllocationBuilder {
    this.ports.push(...ports.map((p) => p.toString()));
    return this;
  }

  /**
   * Set the alias for this allocation
   * @argument alias Alias to bind on
   */
  public setAlias(alias: string): AllocationBuilder {
    this.alias = alias;
    return this;
  }
}
