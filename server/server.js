import { todayData, defaultSlots, weekendSlots } from './database.js';

const DELAY_MS = 600;

export function mockServerPlugin() {
  return {
    name: 'mock-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        res.setHeader('Content-Type', 'application/json');

        if (req.url.startsWith('/api/booking/today')) {
          res.end(JSON.stringify(todayData));
          return;
        }

        if (req.url.startsWith('/api/slots')) {
          const urlObj = new URL(req.url, 'http://localhost');
          const day = Number(urlObj.searchParams.get('day'));
          const month = Number(urlObj.searchParams.get('month'));
          const year = Number(urlObj.searchParams.get('year'));

          const dateObj = new Date(year, month, day);
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
          const slots = isWeekend ? weekendSlots : defaultSlots;

          res.end(JSON.stringify({ date: `${year}-${month}-${day}`, slots }));
          return;
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
      });
    },
  };
}
