import React from 'react';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS_HEADER = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

export default function Calendar({ currentMonth, currentYear, selectedDay, onDayClick, onPrevMonth, onNextMonth, today }) {

    // Чистая функция для сравнения дат
    const compareDates = (dateA, dateB) => {
        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        );
    };

    const isDateSelectable = (date) => {
        return date >= today;
    };

    // Генерация массива ячеек
    const buildCalendarGrid = () => {
        const cells = [];

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let startDayOfWeek = firstDayOfMonth.getDay();
        startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        // Пустые ячейки
        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push({ type: 'empty', id: `empty-${i}` });
        }

        // Дни
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            cells.push({
                type: 'day',
                id: `day-${day}`,
                date,
                dayNumber: day,
                isSelectable: isDateSelectable(date)
            });
        }
        return cells;
    };

    const cells = buildCalendarGrid();

    return (
        <div className="calendar-card">
            <div className="calendar-header">
                <h2>{MONTHS[currentMonth]} {currentYear}</h2>
                <div className="calendar-nav">
                    <button aria-label="Предыдущий месяц" onClick={onPrevMonth}>&lt;</button>
                    <button aria-label="Следующий месяц" onClick={onNextMonth}>&gt;</button>
                </div>
            </div>

            <div className="calendar-grid">
                {WEEKDAYS_HEADER.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}

                {cells.map(cell => {
                    if (cell.type === 'empty') {
                        return <div key={cell.id} className="day disabled"></div>;
                    }

                    let classes = 'day';
                    if (!cell.isSelectable) {
                        classes += ' disabled';
                    } else {
                        classes += ' available';
                        if (compareDates(cell.date, selectedDay)) {
                            classes += ' selected';
                        }
                    }

                    return (
                        <div
                            key={cell.id}
                            className={classes}
                            onClick={() => cell.isSelectable && onDayClick(cell.date)}
                        >
                            {cell.dayNumber}
                        </div>
                    );
                })}
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-dot"></div>
                    <span>Есть свободное время</span>
                </div>
                <div className="legend-item">
                    <span>Светлые даты — нет мест</span>
                </div>
            </div>
        </div>
    );
}
