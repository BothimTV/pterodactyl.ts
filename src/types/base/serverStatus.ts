export type ServerStatus = 'starting' | 'stopping' | 'running' | 'offline';

export enum SERVER_SIGNAL {
  'START' = 'start',
  'STOP' = 'stop',
  'RESTART' = 'restart',
  'KILL' = 'kill',
}

export type ServerSignalOption = 'start' | 'stop' | 'restart' | 'kill';
