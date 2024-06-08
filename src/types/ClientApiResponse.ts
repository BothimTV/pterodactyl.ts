import { Database } from "./BaseApiResponse";
import { FileType, Permission, ServerState } from "./Util";

export type ServerList = {
  object: "list";
  data: Array<Server>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type AccountDetails = {
  object: "user";
  attributes: {
    id: number;
    admin: boolean;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    language: string;
  };
};

export type MultiFactorCode = {
  data: {
    image_url_data: string;
  };
};

export type MultiFactorRecoveryCodes = {
  object: "recovery_tokens";
  attributes: {
    tokens: [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string
    ];
  };
};

export type AccountApiKeyList = {
  object: "list";
  data: Array<AccountApiKey>;
};

export type AccountApiKey = {
  object: "api_key";
  attributes: {
    identifier: string;
    description: string;
    allowed_ips: Array<string>;
    last_used_at: string; // FIXME: Is a timestamp
    created_at: string; // FIXME: Is a timestamp
  };
};

export type AccountApiKeyCreate = {
  object: "api_key";
  attributes: {
    identifier: string;
    description: string;
    allowed_ips: Array<string>;
    last_used_at: string; // FIXME: Is a timestamp
    created_at: string; // FIXME: Is a timestamp
  };
  meta: {
    secret_token: string;
  };
};

export type Server = {
  object: "server";
  attributes: {
    server_owner: boolean;
    identifier: string;
    uuid: string;
    name: string;
    node: string;
    sftp_details: {
      ip: string;
      port: 2022 | number;
    };
    description: string;
    limits: {
      memory: number;
      swap: number;
      disk: number;
      io: number;
      cpu: number;
    };
    feature_limits: {
      databases: number;
      allocations: number;
      backups: number;
    };
    is_suspended: boolean;
    is_installing: boolean;
    relationships: {
      allocations: AllocationList;
    };
  };
  meta: {
    is_server_owner: boolean;
    user_permissions: Array<string>;
  };
};

export type AllocationList = {
  object: "list";
  data: Array<Allocation>;
};

export type Allocation = {
  object: "allocation";
  attributes: {
    id: number;
    ip: string;
    ip_alias: null | string;
    port: number;
    notes: null | string;
    is_default: boolean;
  };
};

export type WebSocket = {
  data: {
    token: string;
    socket: string;
  };
};

export type RessourceUsage = {
  object: "stats";
  attributes: {
    current_state: ServerState;
    is_suspended: boolean;
    resources: {
      memory_bytes: number;
      cpu_absolute: number;
      disk_bytes: number;
      network_rx_bytes: number;
      network_tx_bytes: number;
    };
  };
};

export type FullDatabase = Database & {
  attributes: {
    relationships: {
      password: {
        object: "database_password";
        attributes: {
          password: string;
        };
      };
    };
  };
};

export type FileList = {
  object: "list";
  data: Array<File>;
};

export type File = {
  object: "file_object";
  attributes: {
    name: string;
    mode: string;
    size: number;
    is_file: false;
    is_symlink: false;
    is_editable: false;
    mimetype: FileType;
    created_at: string; // FIXME: Is a timestamp
    modified_at: string; // FIXME: Is a timestamp
  };
};

export type SignedUrl = {
  object: "signed_url";
  attributes: {
    url: string;
  };
};

export type FileDownload = SignedUrl;
export type FileUpload = SignedUrl;

export type ScheduleList = {
  object: "list";
  data: Array<Schedule>;
};

export type Schedule = {
  object: "server_schedule";
  attributes: {
    id: number;
    name: string;
    cron: {
      day_of_week: string;
      day_of_month: string;
      hour: string;
      minute: string;
    };
    is_active: boolean;
    is_processing: boolean;
    last_run_at: null | string; // FIXME: Is a timestamp
    next_run_at: string; // FIXME: Is a timestamp
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
    relationships: {
      tasks: {
        object: "list";
        data: Array<ScheduleTask>;
      };
    };
  };
};

export type ScheduleTask = {
  object: "schedule_task";
  attributes: {
    id: number;
    sequence_id: number;
    action: string;
    payload: string;
    time_offset: number;
    is_queued: boolean;
    created_at: string; // FIXME: Is a timestamp
    updated_at: string; // FIXME: Is a timestamp
  };
};

export type SubUserList = {
  object: "list";
  data: Array<SubUser>;
};

export type SubUser = {
  object: "server_subuser";
  attributes: {
    uuid: string;
    username: string;
    email: string;
    image: string;
    "2fa_enabled": boolean;
    created_at: string; // FIXME: Is a timestamp
    permissions: Array<Permission>;
  };
};

export type BackupList = {
  object: "list";
  data: Array<Backup>;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {};
    };
  };
};

export type Backup = {
  object: "backup";
  attributes: {
    uuid: string;
    name: string;
    ignored_files: Array<string>;
    sha256_hash: null | string;
    bytes: number;
    created_at: string; // FIXME: Is a timestamp
    completed_at: null | string; // FIXME: Is a timestamp
  };
};

export type DownloadBackup = SignedUrl;

export type ServerStartup = {
  object: "list";
  data: Array<StartupVariable>;
  meta: {
    startup_command: string;
    raw_startup_command: string;
  };
};

export type StartupVariable = {
  object: "egg_variable";
  attributes: {
    name: string;
    description: string;
    env_variable: string;
    default_value: string;
    server_value: string;
    is_editable: boolean;
    rules: string;
  };
};
