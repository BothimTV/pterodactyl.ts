export class ScheduleBuilder {

    is_active: boolean = true;
    only_when_online: boolean = true;
    name: string;
    minute: string = "*";
    hour: string = "*";
    day_of_month: string = "*";
    month: string = "*";
    day_of_week: string = "*";

    constructor() {
        this.name = "";
    }

    /**
     * Sets whether the schedule is active.
     * @param isActive Whether the schedule is active.
     */
    setActive(isActive: boolean): ScheduleBuilder {
        this.is_active = isActive;
        return this;
    }

    /**
     * Sets whether the schedule should only run when the server is online.
     * @param onlyWhenOnline Whether the schedule should only run when the server is online.
     */
    setOnlyWhenOnline(onlyWhenOnline: boolean): ScheduleBuilder {
        this.only_when_online = onlyWhenOnline;
        return this;
    }

    /**
     * Sets the name of the schedule.
     * @param name The name of the schedule.
     */
    setName(name: string): ScheduleBuilder {
        this.name = name;
        return this;
    }

    /**
     * Sets the minute of the schedule.
     * Example: *\/5: Every 5 minutes, 
     * 0-59: Range of minutes
     * 1,3,5: Specific minutes
     * *\/5: Every 5 minutes
     * @param minute The minute of the schedule.
     */
    setMinute(minute: string): ScheduleBuilder {
        this.minute = minute;
        return this;
    }

    /**
     * Sets the hour of the schedule.
     * Example: *\/5: Every 5 hours
     * 0-23: Range of hours
     * 1,3,5: Specific hours
     * *\/5: Every 5 hours
     * @param hour The hour of the schedule.
     */
    setHour(hour: string): ScheduleBuilder {
        this.hour = hour;
        return this;
    }

    /**
     * Sets the day of the month of the schedule.
     * Example: *\/5: Every 5th day of the month
     * 1-31: Range of days
     * 1,3,5: Specific days
     * *\/5: Every 5th day of the month
     * @param dayOfMonth The day of the month of the schedule.
     */
    setDayOfMonth(dayOfMonth: string): ScheduleBuilder {
        this.day_of_month = dayOfMonth;
        return this;
    }

    /**
     * Sets the month of the schedule.
     * Example: *\/5: Every 5 months
     * 1-12: Range of months
     * 1,3,5: Specific months
     * *\/5: Every 5 months
     * @param month The month of the schedule.
     */
    setMonth(month: string): ScheduleBuilder {
        this.month = month;
        return this;
    }

    /**
     * Sets the day of the week of the schedule.
     * Example: *\/5: Every 5th day of the week
     * 0-6: Range of days (0 = Sunday, 6 = Saturday)
     * 0,2,4: Specific days
     * *\/5: Every 5th day of the week
     * @param dayOfWeek The day of the week of the schedule.
     */
    setDayOfWeek(dayOfWeek: string): ScheduleBuilder {
        this.day_of_week = dayOfWeek;
        return this;
    }

}
