import { dateFormats } from "../implementations/DayjsDateProvider";

interface IDateProvider {
  dateNow(): Date;
  dateToString(date: Date, format: keyof typeof dateFormats): string;
  addDays(days: number): Date;
  addHours(hours: number): Date;
  addMilliseconds(date: Date, milliseconds: number): Date;
  isBefore(start_date: Date, end_date: Date): boolean;
  compareInDays(start_date: Date, end_date: Date): number;
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
}

export { IDateProvider };
