import axios from "axios";
import { BackupAttributes, RawBackup } from "../types/user/serverBackup";
import { RawSignedUrl } from "../types/user/signedUrl";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient;
export class Backup implements BackupAttributes {
  readonly uuid: string;
  readonly is_successful: true;
  is_locked: false;
  readonly name: string;
  readonly ignored_files: string[];
  readonly checksum: string | null;
  readonly bytes: number;
  readonly created_at: string | Date;
  readonly completed_at?: string | Date | undefined;
  readonly parentServer: Server;

  constructor(
    userClient: UserClient,
    backupProps: RawBackup,
    parentServer: Server,
  ) {
    client = userClient;
    this.uuid = backupProps.attributes.uuid;
    this.is_successful = backupProps.attributes.is_successful;
    this.is_locked = backupProps.attributes.is_locked;
    this.name = backupProps.attributes.name;
    this.ignored_files = backupProps.attributes.ignored_files;
    this.checksum = backupProps.attributes.checksum;
    this.bytes = backupProps.attributes.bytes;
    this.created_at = new Date(backupProps.attributes.created_at);
    this.completed_at = backupProps.attributes.completed_at
      ? new Date(backupProps.attributes.completed_at)
      : undefined;
    this.parentServer = parentServer;
  }

  /**
   * Get a one time download url this backup
   */
  public async downloadUrl(): Promise<URL> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/backups/" +
        this.uuid +
        "/download",
    );
    return new URL(
      (
        (await client.api({ url: endpoint.href })) as RawSignedUrl
      ).attributes.url,
    );
  }

  /**
   * Download this backup
   */
  public async downloadStream(): Promise<Buffer> {
    const downloadURL = await this.downloadUrl();
    const response = await axios.get(downloadURL.href, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  }

  /**
   * Restore this backup
   */
  public async restore(deleteFiles: boolean = false): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/backups/" +
        this.uuid +
        "/restore",
    );
    await client.api({
      url: endpoint.href,
      method: "POST",
      data: { truncate: deleteFiles },
    });
  }

  private async lockRequest() {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/backups/" +
        this.uuid +
        "/lock",
    );
    const res = (await client.api({
      url: endpoint.href,
      method: "POST",
    })) as RawBackup;
    this.is_locked = res.attributes.is_locked;
  }

  /**
   * Lock this backup
   */
  public async lock(): Promise<void> {
    if (this.is_locked) return console.log("Backup is already locked");
    await this.lockRequest();
  }

  /**
   * Unlock this backup
   */
  public async unlock(): Promise<void> {
    if (!this.is_locked) return console.log("Backup is not locked");
    await this.lockRequest();
  }

  /**
   * Delete this backup
   */
  public async delete(): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentServer.identifier +
        "/backups/" +
        this.uuid,
    );
    await client.api({ url: endpoint.href, method: "DELETE" });
  }
}
