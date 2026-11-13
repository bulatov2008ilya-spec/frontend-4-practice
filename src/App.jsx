import React, { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api.js';

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const DAYS_OF_WEEK = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export default function App() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const [todayDate, setTodayDate] = useState(null);
    const [slots, setSlots] = useState([]);

    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        async function loadToday() {
            try {
                setLoadingCalendar(true);
                setError(null);
                const data = await fetchToday();
                if (active) {
                    const todayObj = new Date(data.year, data.month, data.day);
                    todayObj.setHours(0, 0, 0, 0);
                    setTodayDate(todayObj);
                    setCurrentYear(data.year);
                    setCurrentMonth(data.month);
                    setSelectedDay(data.day);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoadingCalendar(false);
            }
        }
        loadToday();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!selectedDay) {
            setSlots([]);
            return;
        }
        let active = true;
        async function loadSlots() {
            try {
                setLoadingSlots(true);
                setError(null);
                const data = await fetchSlots(selectedDay, currentMonth, currentYear);
                if (active) {
                    setSlots(data.slots);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoadingSlots(false);
            }
        }
        loadSlots();
        return () => { active = false; };
    }, [selectedDay, currentMonth, currentYear]);

    if (loadingCalendar) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#61dafb' }}>Загрузка...</div>;
    }

    if (error && !todayDate) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#ff4a4a' }}>Ошибка: {error}</div>;
    }

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleMonthChange = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDay(null);
        setSelectedTime(null);
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setSelectedTime(null);
    };

    const getBottomBarText = () => {
        if (!selectedDay) return 'Выберите дату и время в календаре';
        const dateObj = new Date(currentYear, currentMonth, selectedDay);
        const dayName = DAYS_OF_WEEK[dateObj.getDay()];
        const monthName = MONTHS[currentMonth].toLowerCase();
        const timeText = selectedTime ? ` • Время: ${selectedTime}` : ' • Время не выбрано';
        return `${dayName}, ${selectedDay} ${monthName} ${currentYear} г.${timeText}`;
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', padding: '15px' }}>
                <h1>Барбершоп</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                    <button onClick={() => handleMonthChange(-1)} style={{ padding: '10px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}>&lt;</button>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>{MONTHS[currentMonth]} {currentYear}</span>
                    <button onClick={() => handleMonthChange(1)} style={{ padding: '10px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}>&gt;</button>
                </div>
            </header>

            {error && <div style={{ color: '#ff4a4a', backgroundColor: '#3a2222', padding: '10px', borderRadius: '6px', textAlign: 'center', margin: '10px 0' }}>Ошибка: {error}</div>}

            <main style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <section>
                    <h2>Выберите день</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {daysArray.map((day) => {
                            const cellDate = new Date(currentYear, currentMonth, day);
                            const isDisabled = todayDate && cellDate < todayDate;
                            const isActive = selectedDay === day;

                            return (
                                <button
                                    key={day}
                                    disabled={isDisabled}
                                    onClick={() => handleDayClick(day)}
                                    style={{
                                        padding: '10px',
                                        backgroundColor: isDisabled ? '#222' : (isActive ? '#61dafb' : '#2a2a2a'),
                                        color: isDisabled ? '#555' : (isActive ? '#000' : 'white'),
                                        border: isDisabled ? '1px solid #222' : '1px solid #444',
                                        borderRadius: '6px',
                                        cursor: isDisabled ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2>Доступное время</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                        {loadingSlots ? (
                            <div style={{ gridColumn: '1/-1', color: '#61dafb', textAlign: 'center', padding: '10px' }}>Загрузка слотов...</div>
                        ) : !selectedDay ? (
                            <div style={{ gridColumn: '1/-1', color: '#777', textAlign: 'center', padding: '10px' }}>Выберите день</div>
                        ) : (
                            slots.map((slot) => {
                                const isActive = selectedTime === slot.time;
                                const isBusy = !slot.available;
                                return (
                                    <button
                                        key={slot.time}
                                        disabled={isBusy}
                                        onClick={() => setSelectedTime(slot.time)}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: isBusy ? '#222' : (isActive ? '#61dafb' : '#2a2a2a'),
                                            color: isBusy ? '#555' : (isActive ? '#000' : 'white'),
                                            border: '1px solid #444',
                                            borderRadius: '6px',
                                            cursor: isBusy ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {slot.time}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>

            <footer style={{ textAlign: 'center', padding: '15px', marginTop: '20px' }}>
                <div style={{ backgroundColor: '#2a2a2a', padding: '15px', marginBottom: '15px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {getBottomBarText()}
                </div>
                <button style={{ backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', width: '100%', maxWidth: '300px', cursor: 'pointer', fontSize: '16px' }}>
                    Продолжить
                </button>
            </footer>
        </div>
    );
}
