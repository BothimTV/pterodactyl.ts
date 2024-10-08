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
