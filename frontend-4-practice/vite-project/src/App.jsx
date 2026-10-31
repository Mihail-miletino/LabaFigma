import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import VisitSummary from '../components/VisitSummary';
import Footer from '../components/Footer';
import './index.css';

export default function App() {
  const [today, setToday] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [slots, setSlots] = useState([]);
  const [regSW, setRegSW] = useState(navigator.serviceWorker.controller);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDayClick = async (date) => {
    setLoading(true);
    await getSlots(date);
    setLoading(false);
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

  async function getServiceWorker(){
    if ("serviceWorker" in navigator){
      try{
        const regs = await navigator.serviceWorker.getRegistrations();
        if (regs.length === 0){
          await navigator.serviceWorker.register("/sw.js");
          const sw = await navigator.serviceWorker.ready;
          setRegSW(sw);
        }
      } catch(err){
        console.log(err);
      }
    }
  }

  async function getToday(){
    try{
      const response = await fetch("/api/today", {
        method: "GET"
      });
      const data = await response.json();
      const date = new Date(data.selectedDay);
      setCurrentMonth(data.currentMonth);
      setCurrentYear(data.currentYear);
      setSelectedDay(date);
      setToday(date);
    } catch(err){
      console.log(err);
    }
  }

  async function getSlots(date){
    try{
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      const response = await fetch(`/api/slots?day=${date.getDay()}&month=${date.getMonth()}&year=${date.getFullYear()}`, {
        method: "GET"
      });
      const data = await response.json();
      setSlots(data.times);
    } catch(err){
      console.log(err);
      setError(true);
    }
  }

  useEffect(() => {
    getServiceWorker();
  }, []);

  useEffect(() => {
    if (regSW){
      getToday();
      getSlots(today);
    }
  }, [regSW]);

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
                loading={loading}
                error={error}
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
