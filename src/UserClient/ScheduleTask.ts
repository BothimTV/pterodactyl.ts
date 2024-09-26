import { ServerSignalOption } from "../types/base/serverStatus";
import {
  RawScheduleTask,
  ScheduleActionType,
  ScheduleTaskAttributes,
} from "../types/user/scheduleTask";
import { Schedule } from "./Schedule";
import { UserClient } from "./UserClient";

let client: UserClient;
export class ScheduleTask implements ScheduleTaskAttributes {
  readonly id: number;
  readonly sequence_id: number;
  action: ScheduleActionType;
  payload: string | ServerSignalOption;
  time_offset: number;
  readonly is_queued: boolean;
  continue_on_failure: boolean;
  readonly created_at: Date;
  updated_at: Date;
  readonly parentSchedule: Schedule;

  constructor(
    userClient: UserClient,
    taskProps: RawScheduleTask,
    parentSchedule: Schedule,
  ) {
    client = userClient;
    this.id = taskProps.attributes.id;
    this.sequence_id = taskProps.attributes.sequence_id;
    this.action = taskProps.attributes.action;
    this.payload = taskProps.attributes.payload;
    this.time_offset = taskProps.attributes.time_offset;
    this.is_queued = taskProps.attributes.is_queued;
    this.continue_on_failure = taskProps.attributes.continue_on_failure;
    this.created_at = new Date(taskProps.attributes.created_at);
    this.updated_at = new Date(taskProps.attributes.updated_at);
    this.parentSchedule = parentSchedule;
  }

  private updateProps() {
    return {
      action: this.action,
      payload: this.payload,
      continue_on_failure: this.continue_on_failure,
      time_offset: this.time_offset,
    };
  }

  private async updateThis(data: any) {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentSchedule.parentServer.identifier +
        "/schedules/" +
        this.id,
    );
    const res = (await client.api({
      url: endpoint.href,
      method: "POST",
      data: data,
    })) as RawScheduleTask;
    this.action = res.attributes.action;
    this.payload = res.attributes.payload;
    this.continue_on_failure = res.attributes.continue_on_failure;
    this.time_offset = res.attributes.time_offset;
    this.updated_at = new Date(res.attributes.updated_at);
  }

  /**
   * Set the action type (and a new payload)
   */
  public async setAction(
    action: ScheduleActionType,
    payload?: string | ServerSignalOption,
  ): Promise<void> {
    var data = this.updateProps();
    data.action = action;
    if (payload) data.payload = payload;
    await this.updateThis(data);
  }

  /**
   * Update the payload of the task
   * @param payload The new payload
   */
  public async setPayload(payload: string | ServerSignalOption): Promise<void> {
    var data = this.updateProps();
    data.payload = payload;
    await this.updateThis(data);
  }

  /**
   * Update the continue_on_failure flag of the task
   * @param continueOnFailure The new continue_on_failure flag
   */
  public async setContinueOnFailure(continueOnFailure: boolean): Promise<void> {
    var data = this.updateProps();
    data.continue_on_failure = continueOnFailure;
    await this.updateThis(data);
  }

  /**
   * Update the time_offset of the task
   * @param timeOffset The new time_offset
   */
  public async setTimeOffset(timeOffset: number): Promise<void> {
    var data = this.updateProps();
    data.time_offset = timeOffset;
    await this.updateThis(data);
  }

  /**
   * Delete this task
   */
  public async delete(): Promise<void> {
    const endpoint = new URL(
      client.panel +
        "/api/client/servers/" +
        this.parentSchedule.parentServer.identifier +
        "/schedules/" +
        this.id,
    );
    await client.api({ url: endpoint.href, method: "DELETE" });
  }
}
