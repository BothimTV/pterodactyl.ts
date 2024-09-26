import { ServerSignalOption } from "../base/serverStatus";

export interface RawScheduleTaskList {
  object: "list";
  data: Array<RawScheduleTask>;
}

export interface RawScheduleTask {
  object: "schedule_task";
  attributes: ScheduleTaskAttributes;
}

export interface ScheduleTaskAttributes {
  readonly id: number;
  readonly sequence_id: number;
  action: ScheduleActionType;
  payload: string | ServerSignalOption;
  time_offset: number;
  readonly is_queued: boolean;
  continue_on_failure: boolean;
  readonly created_at: string | Date;
  updated_at: string | Date;
}

export type ScheduleActionType = "command" | "power" | "backup";
