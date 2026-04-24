## Mental model

A `node-cron` expression is just a compact way to say **when** a function should run.  In `node-cron`, you usually write 5 fields, and you can optionally add a 6th field at the front for seconds. [dev](https://dev.to/evanloria4/node-cron-automation-in-nodejs-4949)

Read the expression from left to right as `minute hour day-of-month month day-of-week`, or `second minute hour day-of-month month day-of-week` when you use the optional seconds field.  So `0 8 * * *` means “at minute 0, hour 8, every day, every month,” which is 8:00 AM daily. [npmjs](https://www.npmjs.com/package/node-cron)

- `*` means “every value” for that field, like every minute or every month. [freecodecamp](https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/)
- `*/n` means “pick every nth value in that field’s allowed range,” so `*/5` in the minute field means every 5 minutes. [nodecron](https://nodecron.com/cron-syntax.html)
- `1,3,5` means specific values, and `1-5` means a range. [freecodecamp](https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/)

## Field meanings

The five main fields are minute, hour, day of month, month, and day of week.  Allowed values are `0-59` for minutes, `0-23` for hours, `1-31` for day of month, `1-12` for month, and `0-7` for day of week, where Sunday is `0` or `7`. [dev](https://dev.to/evanloria4/node-cron-automation-in-nodejs-4949)

A useful detail is that month and weekday can often be written with names like `JAN` or `MON`, which makes some expressions easier to read.  Also, cron matches when the time fields line up, and the day-of-month and day-of-week fields need extra care because their behavior can be less intuitive than the other fields. [npmjs](https://www.npmjs.com/package/node-cron)

## Decode examples

`* * * * *` means “run every minute,” and it is the simplest starting point.  `*/10 * * * * *` means “run every 10 seconds,” because the first field is the optional seconds field. [dev](https://dev.to/evanloria4/node-cron-automation-in-nodejs-4949)

`0 */2 * * *` means “run at minute 0 of every 2nd hour,” so 12:00, 2:00, 4:00, and so on.  `30 8 * * 1-5` means “run at 8:30 AM on weekdays,” because `1-5` maps to Monday through Friday. [npmjs](https://www.npmjs.com/package/node-cron)

A good way to read any string is: first find the unit order, then replace `*` with “every,” `*/n` with “every n,” commas with “at these values,” and ranges with “from x to y.” [freecodecamp](https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/)

## Node examples

Start with the easiest possible task so the pattern becomes familiar before you use real jobs. [dev](https://dev.to/evanloria4/node-cron-automation-in-nodejs-4949)

```js
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('Runs every minute');
});
```

This next one runs every day at 2:00 AM, which is a common pattern for cleanup or backups. [digitalocean](https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples)

```js
import cron from 'node-cron';

cron.schedule('0 2 * * *', async () => {
  await cleanupOldLogs();
});
```

This one runs every weekday at 8:30 AM. [npmjs](https://www.npmjs.com/package/node-cron)

```js
import cron from 'node-cron';

cron.schedule('30 8 * * 1-5', () => {
  console.log('Weekday morning task');
});
```

## Safer usage and tricky example

If the string still feels intimidating, validate it before scheduling the task, because `node-cron` exposes `cron.validate(expression)` for that purpose.  For example, `10 * * * * *` is valid, while `60 * * * * *` is invalid because seconds cannot be `60`. [betterstack](https://betterstack.com/community/guides/scaling-nodejs/node-cron-scheduled-tasks/)

When jobs can take time, use options like `timezone` and `noOverlap` so runs happen in the right zone and do not pile up on top of each other.  A practical example is scheduling a task for `Asia/Kolkata` and preventing a second run from starting while the first is still executing. [nodecron](https://nodecron.com/scheduling-options)

```js
import cron from 'node-cron';

cron.schedule('0 9 * * *', async () => {
  await generateDailyReport();
}, {
  timezone: 'Asia/Kolkata',
  noOverlap: true,
});
```

A simple trick for learning is to first write the sentence in English, like “every 5 minutes” or “at 8:30 on weekdays,” and only then translate it into cron as `*/5 * * * *` or `30 8 * * 1-5`. [freecodecamp](https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/)

In `node-cron`, `*/n` means “pick every nth value in that field’s allowed range,” not “wait n units after the last run.”  So the meaning depends entirely on which field you put it in: seconds, minutes, hours, months, and so on. [nodecron](https://nodecron.com/cron-syntax.html)

For example, in the seconds field, `*/10` means `0,10,20,30,40,50`, so yes, it runs every 10 seconds within each minute.  But `10` means only “at second 10,” and `30` means only “at second 30,” not “every 30 seconds.” [nodecron](https://nodecron.com/cron-syntax.html)

The expression `30 30 */2 * */3 6,7` has 6 fields, so it is read as `second minute hour day-of-month month day-of-week`.  That means: second `30`, minute `30`, every 2 hours, every day of the month, every 3rd month, and only on Saturday or Sunday. [nodecron](https://nodecron.com/cron-syntax.html)

So the plain-English meaning is: run at `HH:30:30`, every 2 hours, on weekends, in every 3rd month.  In practice, that usually means times like `00:30:30`, `02:30:30`, `04:30:30`, and months like `1,4,7,10` when the month field is `*/3`. [dev](https://dev.to/evanloria4/node-cron-automation-in-nodejs-4949)

The key distinction is this: `30` means “at 30,” while `*/30` means “every 30.”  So if you wanted “every 30 seconds” instead of “at second 30,” the first field would need to be `*/30`, not `30`. [freecodecamp](https://www.freecodecamp.org/news/schedule-a-job-in-node-with-nodecron/)

```txt
30 30 */2 * */3 6,7
│  │   │   │  │   └── day of week = Saturday and Sunday
│  │   │   │  └────── month = every 3 months
│  │   │   └───────── day of month = every day
│  │   └───────────── hour = every 2 hours
│  └───────────────── minute = 30
└──────────────────── second = 30
```

English version: “At 30 seconds and 30 minutes past the hour, every 2 hours, every day, every 3rd month, only on weekends.” [nodecron](https://nodecron.com/cron-syntax.html)

Use this mental shortcut when reading cron strings: plain numbers mean “exactly this value,” while `*/n` means “every n values in this field.”  That single rule removes most of the confusion.