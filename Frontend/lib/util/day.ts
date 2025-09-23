import dayjs from "dayjs";

const defaultDayFormat = "DD.MM.YYYY";
const defaultWeekdayFormat = "dddd, DD.MM.YYYY";

const shortDayFormat = "D.M.YY";
const shortDateFormat = "ddd, D.M.YY";

export const formatDate = (date: string, short: boolean = false) => {
  const format = short ? shortDayFormat : defaultDayFormat;
  return dayjs(date).format(format);
};

export const formatPeriod = (
  from: string,
  to: string,
  short: boolean = false
) => {
  const format = short ? shortDayFormat : defaultDayFormat;
  return `${dayjs(from).format(format)} - ${dayjs(to).format(format)}`;
};

export const formatDayWithWeekday = (date: string, short: boolean = false) => {
  const format = short ? shortDateFormat : defaultWeekdayFormat;
  return dayjs(date).format(format);
};

export const formatPeriodWithWeekday = (
  from: string,
  to: string,
  short: boolean = false
) => {
  const format = short ? shortDateFormat : defaultWeekdayFormat;
  return `${dayjs(from).format(format)} - ${dayjs(to).format(format)}`;
};
