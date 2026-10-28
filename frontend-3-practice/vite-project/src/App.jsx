import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import VisitSummary from '../components/VisitSummary';
import Footer from '../components/Footer';
import './index.css';

export default function App() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [slots, setSlots] = useState([]);

  const AVAILABLE_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  useEffect(() => {
    const isWeekend = selectedDay.getDay() === 0 || selectedDay.getDay() === 6;
    const timesForDay = isWeekend ? AVAILABLE_TIMES.slice(0, 4) : AVAILABLE_TIMES;
    setSlots(timesForDay);

    if (!timesForDay.includes(selectedTime)) {
      setSelectedTime(timesForDay[0]);
    }
  }, [selectedDay]);

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

    if (prevMonthDate >= currentMonthDate) {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <section className="booking-section">
            <h1>Найдём время для себя</h1>
            <p className="subtitle">Женская стрижка у Марии Волковой займёт 60 минут. Всё остальное подождёт.</p>

            <Calendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                today={today}
            />

            <TimeSlots
                slots={slots}
                selectedTime={selectedTime}
                onTimeClick={handleTimeClick}
            />

            <div className="actions">
              <button className="btn-back"><span>←</span> Назад</button>
              <button className="btn-primary">Ввести контактные данные</button>
            </div>
          </section>

          <VisitSummary
              selectedDay={selectedDay}
              selectedTime={selectedTime}
          />
        </main>
        <Footer />
      </div>
  );
}
