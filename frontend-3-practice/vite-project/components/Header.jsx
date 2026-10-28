import React from 'react';

export default function Header() {
    return (
        <header className="header">
            <div className="breadcrumbs">Главная / Запись онлайн</div>
            <div className="stepper">
                <div className="step completed">
                    <div className="step-circle"></div>
                    <span>Мастер</span>
                </div>
                <div className="step completed">
                    <div className="step-circle"></div>
                    <span>Услуга</span>
                </div>
                <div className="step active">
                    <div className="step-circle">3</div>
                    <span>Дата и время</span>
                </div>
                <div className="step">
                    <div className="step-circle">4</div>
                    <span>Ваши данные</span>
                </div>
                <div className="step">
                    <div className="step-circle">5</div>
                    <span>Проверка</span>
                </div>
            </div>
        </header>
    );
}
