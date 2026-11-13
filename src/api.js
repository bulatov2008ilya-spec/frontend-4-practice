export async function fetchToday() {
  const response = await fetch('/api/booking/today');
  if (!response.ok) {
    throw new Error('Ошибка сервера при загрузке даты');
  }
  return response.json();
}

export async function fetchSlots(day, month, year) {
  const response = await fetch(`/api/slots?day=${day}&month=${month}&year=${year}`);
  if (!response.ok) {
    throw new Error('Ошибка сервера при загрузке слотов');
  }
  return response.json();
}
