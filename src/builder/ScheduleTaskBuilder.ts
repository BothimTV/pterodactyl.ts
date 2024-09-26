import { ServerSignalOption } from "../types/base/serverStatus";
import { ScheduleActionType } from "../types/user/scheduleTask";

export class ScheduleTaskBuilder {
  action: ScheduleActionType = "command";
  continue_on_failure: boolean = false;
  payload: string | ServerSignalOption;
  time_offset: number = 0;

  constructor() {
    this.payload = "";
  }

  /**
   * Sets the action type for the task.
   * @param action The action type.
   */
  setAction(action: ScheduleActionType): ScheduleTaskBuilder {
    this.action = action;
    return this;
  }

  /**
   * Sets whether the task should continue even if it fails.
   * @param continueOnFailure Whether the task should continue even if it fails.
   */
  setContinueOnFailure(continueOnFailure: boolean): ScheduleTaskBuilder {
    this.continue_on_failure = continueOnFailure;
    return this;
  }

  /**
   * Sets the payload for the task.
   * --------------------------
   * Depending on the action type the payload is
   * - the command that will be executed
   * - a ServerSignal
   * - a list of ignored files for a backup
   * --------------------------
   * @param payload The payload for the task.
   */
  setPayload(payload: string | ServerSignalOption): ScheduleTaskBuilder {
    this.payload = payload;
    return this;
  }

  /**
   * Sets the time offset for the task.
   * @param timeOffset The time offset for the task.
   */
  setTimeOffset(timeOffset: number): ScheduleTaskBuilder {
    this.time_offset = timeOffset;
    return this;
  }
}
