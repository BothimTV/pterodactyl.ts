export interface RawFileList {
  object: "list";
  data: Array<RawFile>;
}

export interface RawFile {
  object: "file_object";
  attributes: FileAttributes;
}

export type MimeType = "text/plain; charset=utf-8"

export interface FileAttributes {
  name: string
  readonly mode: string;
  readonly mode_bits: string;
  readonly size: number;
  readonly is_file: boolean;
  readonly is_symlink: boolean;
  mimetype: string | MimeType;
  readonly created_at: string | Date;
  modified_at: string | Date;
}
