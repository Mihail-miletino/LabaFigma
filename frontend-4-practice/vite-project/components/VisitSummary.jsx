import React from 'react';

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export default function VisitSummary({ selectedDay, selectedTime }) {

    const formatDate = () => {
        if (!selectedDay || !selectedTime) return 'Выберите дату и время';

        const dayOfWeek = WEEKDAYS_SHORT[selectedDay.getDay()];
        const day = selectedDay.getDate();
        const month = MONTHS_GENITIVE[selectedDay.getMonth()];
        const year = selectedDay.getFullYear();

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const endHours = String(hours + 1).padStart(2, '0');
        const endMinutes = String(minutes).padStart(2, '0');
        const endTime = `${endHours}:${endMinutes}`;

        return `${dayOfWeek}, ${day} ${month} ${year} • ${selectedTime}–${endTime}`;
    };

    return (
        <aside className="visit-card">
            <h2>Ваш визит</h2>

            <div className="master-info">
                <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Мария Волкова" />
                <div>
                    <h3>Мария Волкова</h3>
                    <p>Топ-стилист • ★ 4,9</p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="summary-row">
                <span className="label">Услуга</span>
                <span>Женская стрижка • 60 минут</span>
            </div>

            {/* Сюда выводим отформатированную дату */}
            <div className="summary-row">
                <span className="label">Дата и время</span>
                <span id="summaryDate">{formatDate()}</span>
            </div>

            <div className="divider"></div>

            <div className="summary-row total">
                <span className="label">Итого</span>
                <span>3 200 ₽</span>
            </div>

            <p className="visit-note">Оплата в салоне после визита. В стоимость входят консультация, мытьё и укладка.</p>

            <div className="address">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>Покровка, 14</span>
            </div>
        </aside>
    );
}
