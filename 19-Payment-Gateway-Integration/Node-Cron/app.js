import cron from "node-cron";

/*
The five main fields are minute, hour, day of month, month, and day of week. Allowed values are 0-59 for minutes, 0-23 for hours, 1-31 for day of month, 1-12 for month, and 0-7 for day of week, where Sunday is 0 or 7
*/

// * -> means each-and-every
// 1. minute hour day-of-month month day-of-week
// 2. seconds(optional) minute hour day-of-month month day-of-week

// 1. * * * * * means “run every minute,” and it is the simplest starting point.

// 2. */10 * * * * * means “run every 10 seconds,” because the first field is the optional seconds field.

// run at every 8:30 AM every day every month every weekday(mon-fri)
cron.schedule("30 8 * * 1-5", () => {});

// A good way to read any string is: first find the unit order, then replace * with “every,” */n with “every n,” commas with “at these values,” and ranges with “from x to y.”
