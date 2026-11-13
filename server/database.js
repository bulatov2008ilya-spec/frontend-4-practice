export const todayData = {
  day: new Date().getDate(),
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

export const defaultSlots = [
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
];

export const weekendSlots = [
  { time: '11:00', available: true },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
];
