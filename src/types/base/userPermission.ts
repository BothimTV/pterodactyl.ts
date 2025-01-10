export type UserPermission =
  | 'control.restart'
  | 'control.start'
  | 'control.stop'
  | 'user.delete'
  | 'websocket.connect'
  | 'control.console'
  | 'user.create'
  | 'user.read'
  | 'user.update'
  | 'file.create'
  | 'file.read'
  | 'file.read-content'
  | 'file.update'
  | 'file.delete'
  | 'file.archive'
  | 'file.sftp'
  | 'backup.create'
  | 'backup.read'
  | 'backup.delete'
  | 'backup.download'
  | 'backup.restore'
  | 'allocation.read'
  | 'allocation.create'
  | 'allocation.update'
  | 'allocation.delete'
  | 'startup.read'
  | 'startup.update'
  | 'startup.docker-image'
  | 'database.create'
  | 'database.read'
  | 'database.update'
  | 'database.delete'
  | 'database.view_password'
  | 'schedule.create'
  | 'schedule.read'
  | 'schedule.update'
  | 'schedule.delete'
  | 'settings.rename'
  | 'settings.reinstall'
  | 'activity.read';

export enum USER_PERMISSION {
  'CONTROL_RESTART' = 'control.restart',
  'CONTROL_START' = 'control.start',
  'CONTROL_STOP' = 'control.stop',
  'USER_DELETE' = 'user.delete',
  'WEBSOCKET_CONNECT' = 'websocket.connect',
  'CONTROL_CONSOLE' = 'control.console',
  'USER_CREATE' = 'user.create',
  'USER_READ' = 'user.read',
  'USER_UPDATE' = 'user.update',
  'FILE_CREATE' = 'file.create',
  'FILE_READ' = 'file.read',
  'FILE_READ_CONTENT' = 'file.read-content',
  'FILE_UPDATE' = 'file.update',
  'FILE_DELETE' = 'file.delete',
  'FILE_ARCHIVE' = 'file.archive',
  'FILE_SFTP' = 'file.sftp',
  'BACKUP_CREATE' = 'backup.create',
  'BACKUP_READ' = 'backup.read',
  'BACKUP_DELETE' = 'backup.delete',
  'BACKUP_DOWNLOAD' = 'backup.download',
  'BACKUP_RESTORE' = 'backup.restore',
  'ALLOCATION_READ' = 'allocation.read',
  'ALLOCATION_CREATE' = 'allocation.create',
  'ALLOCATION_UPDATE' = 'allocation.update',
  'ALLOCATION_DELETE' = 'allocation.delete',
  'STARTUP_READ' = 'startup.read',
  'STARTUP_UPDATE' = 'startup.update',
  'STARTUP_DOCKER_IMAGE' = 'startup.docker-image',
  'DATABASE_CREATE' = 'database.create',
  'DATABASE_READ' = 'database.read',
  'DATABASE_UPDATE' = 'database.update',
  'DATABASE_DELETE' = 'database.delete',
  'DATABASE_VIEW_PASSWORD' = 'database.view_password',
  'SCHEDULE_CREATE' = 'schedule.create',
  'SCHEDULE_READ' = 'schedule.read',
  'SCHEDULE_UPDATE' = 'schedule.update',
  'SCHEDULE_DELETE' = 'schedule.delete',
  'SETTINGS_RENAME' = 'settings.rename',
  'SETTINGS_REINSTALL' = 'settings.reinstall',
  'ACTIVITY_READ' = 'activity.read',
}
