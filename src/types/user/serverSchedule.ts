import { RawScheduleTaskList } from './scheduleTask';

export interface RawServerScheduleList {
  object: 'list';
  data: Array<RawServerSchedule>;
}

export interface RawServerSchedule {
  object: 'server_schedule';
  attributes: ServerScheduleAttributes;
}

export interface ServerScheduleAttributes {
  readonly id: number;
  name: string;
  cron: {
    day_of_week: '*' | string;
    day_of_month: '*' | string;
    month: '*' | string;
    hour: '*' | string;
    minute: '*' | string;
  };
  readonly is_active: boolean;
  readonly is_processing: boolean;
  only_when_online: boolean;
  last_run_at: null | string | Date;
  next_run_at: string | Date;
  readonly created_at: string | Date;
  updated_at: string | Date;
  readonly relationships: {
    readonly tasks: RawScheduleTaskList;
  };
}
