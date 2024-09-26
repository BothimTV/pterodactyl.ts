export interface RawBackupList {
  object: 'list';
  data: Array<RawBackup>;
}

export interface RawBackup {
  object: 'backup';
  attributes: BackupAttributes;
}

export interface BackupAttributes {
  readonly uuid: string;
  readonly is_successful: true;
  readonly is_locked: false;
  readonly name: string;
  readonly ignored_files: Array<string>;
  readonly checksum: null | string;
  readonly bytes: number;
  readonly created_at: string | Date;
  readonly completed_at?: string | Date;
}
