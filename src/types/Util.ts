export type ServerState = "offline" | "running";
export type PowerAction = "start" | "stop" | "restart";
export type FileType =
  | "inode/directory"
  | "application/json"
  | "text/plain"
  | "inode/x-empty"
  | "application/jar"
  | "application/tar+gzip";
export type Permission =
  | "control.console"
  | "control.restart"
  | "control.start"
  | "control.stop"
  | "file.archive"
  | "file.create"
  | "file.delete"
  | "file.read"
  | "file.read-content"
  | "file.sftp"
  | "file.update"
  | "backup.create"
  | "backup.download"
  | "backup.read"
  | "database.read"
  | "schedule.create"
  | "schedule.delete"
  | "schedule.read"
  | "schedule.update"
  | "activity.read"
  | "user.create"
  | "user.delete"
  | "user.read"
  | "user.update"
  | "backup.delete"
  | "backup.restore"
  | "allocation.create"
  | "allocation.delete"
  | "allocation.read"
  | "allocation.update"
  | "startup.docker-image"
  | "startup.read"
  | "startup.update"
  | "database.create"
  | "database.delete"
  | "database.update"
  | "database.view_password"
  | "settings.reinstall";
export type ClientOptions = {
  apikey: string;
  panel: string;
};  