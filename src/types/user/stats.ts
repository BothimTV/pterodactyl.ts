import { ServerStatus } from '../base/serverStatus';

export interface RawStats {
  object: 'stats';
  attributes: StatsAttributes;
}

export interface StatsAttributes {
  current_state: ServerStatus;
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}
