import React from 'react';

export default function TimeSlots({ slots, selectedTime, onTimeClick, loading, error }) {
    return (
        <div className="time-section">
            <h3>Утро</h3>
            <div className="time-grid">
                {(loading) ? "Загрузка..." :
                    (error) ? "Что-то пошло не так: возможно проблемы с интернетом или сервер недоступен" :
                        slots.map(time => (
                            <div
                                key={time}
                                className={`time-slot ${time === selectedTime ? 'selected' : ''}`}
                                onClick={() => onTimeClick(time)}
                            >
                                {time}
                            </div>
                        ))
                }
            </div>
        </div>
    );
}
