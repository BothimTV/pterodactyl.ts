import { ScheduleTaskBuilder } from "../builder/ScheduleTaskBuilder";
import { RawScheduleTaskList } from "../types/user/scheduleTask";
import {
    RawServerSchedule,
    ServerScheduleAttributes,
} from "../types/user/serverSchedule";
import { ScheduleTask } from "./ScheduleTask";
import { Server } from "./Server";
import { UserClient } from "./UserClient";

let client: UserClient;
export class Schedule implements ServerScheduleAttributes {
    readonly id: number;
    name: string;
    cron: {
        day_of_week: string;
        day_of_month: string;
        month: string;
        hour: string;
        minute: string;
    };
    is_active: boolean;
    readonly is_processing: boolean;
    only_when_online: boolean;
    last_run_at: string | Date | null;
    next_run_at: string | Date;
    readonly created_at: Date;
    updated_at: Date;
    readonly relationships: {
        readonly tasks: RawScheduleTaskList;
    };
    tasks: Array<ScheduleTask>;
    readonly parentServer: Server

    constructor(userClient: UserClient, scheduleProps: RawServerSchedule, parentServer: Server) {
        client = userClient;
        this.id = scheduleProps.attributes.id;
        this.name = scheduleProps.attributes.name;
        this.cron = scheduleProps.attributes.cron;
        this.is_active = scheduleProps.attributes.is_active;
        this.is_processing = scheduleProps.attributes.is_processing;
        this.only_when_online = scheduleProps.attributes.only_when_online;
        this.last_run_at = scheduleProps.attributes.last_run_at;
        this.next_run_at = scheduleProps.attributes.next_run_at;
        this.created_at = new Date(scheduleProps.attributes.created_at);
        this.updated_at = new Date(scheduleProps.attributes.updated_at);
        this.relationships = scheduleProps.attributes.relationships;
        this.tasks = this.relationships.tasks.data.map(task => new ScheduleTask(client, task, this));
        this.parentServer = parentServer;
    }

    private updateProps() {
        return {
            is_active: this.is_active,
            only_when_online: this.only_when_online,
            name: this.name,
            minute: this.cron.minute,
            hour: this.cron.hour,
            day_of_month: this.cron.day_of_month,
            month: this.cron.month,
            day_of_week: this.cron.day_of_week,
        };
    }

    private async updateThis(data: any) {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/schedules/" + this.id);
        const res = await client.api({ url: endpoint.href, method: "POST", data: data }) as RawServerSchedule
        this.is_active = res.attributes.is_active
        this.only_when_online = res.attributes.only_when_online
        this.name = res.attributes.name;
        this.cron = res.attributes.cron;
        this.updated_at = new Date(res.attributes.updated_at)
    }

    /**
     * Set wether the schedule is active
     */
    public async setActive(active: boolean): Promise<void> {
        var data = this.updateProps();
        data.is_active = active;
        await this.updateThis(data);
    }

    /**
     * Set wether the schedule should only run when the server is online
     */
    public async setOnlyWhenOnline(onlyWhenOnline: boolean): Promise<void> {
        var data = this.updateProps();
        data.only_when_online = onlyWhenOnline;
        await this.updateThis(data);
    }

    /**
     * Set the name of the schedule
     */
    public async setName(name: string): Promise<void> {
        var data = this.updateProps();
        data.name = name;
        await this.updateThis(data);
    }

    /**
     * Set the minute of the cron schedule
     */
    public async setMinute(minute: string): Promise<void> {
        var data = this.updateProps();
        data.minute = minute;
        await this.updateThis(data);
    }

    /**
     * Set the hour of the cron schedule
     */
    public async setHour(hour: string): Promise<void> {
        var data = this.updateProps();
        data.hour = hour;
        await this.updateThis(data);
    }

    /**
     * Set the day of month of the cron schedule
     */
    public async setDayOfMonth(dayOfMonth: string): Promise<void> {
        var data = this.updateProps();
        data.day_of_month = dayOfMonth;
        await this.updateThis(data);
    }

    /**
     * Set the month of the cron schedule
     */
    public async setMonth(month: string): Promise<void> {
        var data = this.updateProps();
        data.month = month;
        await this.updateThis(data);
    }

    /**
     * Set the day of week of the cron schedule
     */
    public async setDayOfWeek(dayOfWeek: string): Promise<void> {
        var data = this.updateProps();
        data.day_of_week = dayOfWeek;
        await this.updateThis(data);
    }

    /**
     * Delete this schedule
     */
    public async delete(): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/schedules/" + this.id);
        await client.api({ url: endpoint.href, method: "DELETE" });
    }

    /**
     * Create a task for this schedule
     */
    public async createTask(task: ScheduleTaskBuilder): Promise<void> {
        const endpoint = new URL(client.panel + "/api/client/servers/" + this.parentServer.identifier + "/schedules/" + this.id + "/tasks");
        await client.api({ url: endpoint.href, method: "POST", data: task });
    }

}
