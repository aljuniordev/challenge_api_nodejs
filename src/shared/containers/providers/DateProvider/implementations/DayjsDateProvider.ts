import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { IDateProvider } from "../model/IDateProvider";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export enum dateFormats {
  "DD/MM/YYYY",
  "YYYY-MM-DD",
}

class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().toDate();
  }

  dateToString(date: Date, format: keyof typeof dateFormats = "DD/MM/YYYY"): string {
    return dayjs(date).utc().format(format);
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  addMilliseconds(date: Date, milliseconds: number): Date {
    return dayjs(date).add(milliseconds, "milliseconds").toDate();
  }

  isBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(end_date).isBefore(start_date);
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "days");
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const start_date_utc = this.convertToUTC(start_date);
    const end_date_utc = this.convertToUTC(end_date);

    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }
}

export { DayjsDateProvider };
