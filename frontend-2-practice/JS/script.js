document.addEventListener('DOMContentLoaded', init);

// --- Шаг 3. Состояние ---
const state = {
    currentMonth: 0,
    currentYear: 0,
    selectedDay: null,   // объект Date
    selectedTime: '',
    slots: []
};

// Справочники (константы)
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const WEEKDAYS_HEADER = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const AVAILABLE_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

// DOM-элементы
let calendarGrid, timeGrid, monthYearLabel, btnPrev, btnNext, summaryDate;

// --- Шаг 4. Чистые функции ---

// Сравнивает две даты по дню (без времени)
function compareDates(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}

// Проверяет, можно ли выбрать дату (не раньше сегодня)
function isDateSelectable(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
}

// Формирует массив ячеек для сетки календаря (дни недели + пустые + дни)
function buildCalendarGrid(year, month) {
    const cells = [];

    // Заголовки дней недели
    WEEKDAYS_HEADER.forEach(day => {
        cells.push({ type: 'weekday', text: day });
    });

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Сдвиг: 0 = Вс, нужно 6; иначе -1
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Пустые ячейки перед первым днём
    for (let i = 0; i < startDayOfWeek; i++) {
        cells.push({ type: 'empty' });
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        cells.push({
            type: 'day',
            date: date,
            dayNumber: day,
            isSelectable: isDateSelectable(date)
        });
    }

    return cells;
}

// --- Шаг 5. Рендер ---

function renderCalendar() {
    monthYearLabel.textContent = `${MONTHS[state.currentMonth]} ${state.currentYear}`;

    const cells = buildCalendarGrid(state.currentYear, state.currentMonth);

    calendarGrid.innerHTML = cells.map(cell => {
        if (cell.type === 'weekday') {
            return `<div class="weekday">${cell.text}</div>`;
        }
        if (cell.type === 'empty') {
            return `<div class="day disabled"></div>`;
        }

        // Определяем классы для дня
        let classes = 'day';
        if (!cell.isSelectable) {
            classes += ' disabled';
        } else {
            classes += ' available';
            if (compareDates(cell.date, state.selectedDay)) {
                classes += ' selected';
            }
        }

        return `<div class="${classes}" data-date="${cell.date.toISOString()}" data-day="${cell.dayNumber}">${cell.dayNumber}</div>`;
    }).join('');

    // После вставки HTML вешаем обработчики на кликабельные дни
    const dayElements = calendarGrid.querySelectorAll('.day.available');
    dayElements.forEach(el => {
        el.addEventListener('click', () => {
            const dateStr = el.getAttribute('data-date');
            onDayClick(new Date(dateStr));
        });
    });
}

function renderTimeSlots() {
    timeGrid.innerHTML = state.slots.map(time => {
        const isSelected = time === state.selectedTime;
        return `<div class="time-slot ${isSelected ? 'selected' : ''}" data-time="${time}">${time}</div>`;
    }).join('');

    // Вешаем обработчики на новые слоты
    const slotElements = timeGrid.querySelectorAll('.time-slot');
    slotElements.forEach(el => {
        el.addEventListener('click', () => {
            const time = el.getAttribute('data-time');
            onTimeSlotClick(time);
        });
    });
}

// --- Шаг 6. Обработчики ---

function onDayClick(date) {
    if (!isDateSelectable(date)) return;

    state.selectedDay = date;

    // Обновляем слоты для нового дня
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    state.slots = isWeekend ? AVAILABLE_TIMES.slice(0, 4) : [...AVAILABLE_TIMES];

    // Если выбранное время недоступно в этом дне — сбрасываем
    if (!state.slots.includes(state.selectedTime)) {
        state.selectedTime = state.slots[0] || '';
    }

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

function onTimeSlotClick(time) {
    state.selectedTime = time;
    renderTimeSlots();
    updateBottomBar();
}

function setupMonthNavigation() {
    btnPrev.addEventListener('click', () => {
        const today = new Date();
        const prevMonthDate = new Date(state.currentYear, state.currentMonth - 1, 1);
        const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

        // Не даём уйти в прошлое
        if (prevMonthDate >= currentMonthDate) {
            state.currentMonth--;
            if (state.currentMonth < 0) {
                state.currentMonth = 11;
                state.currentYear--;
            }
            renderCalendar();
        }
    });

    btnNext.addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });
}

// --- Шаг 7. Нижняя панель ---

function updateBottomBar() {
    if (!state.selectedDay || !state.selectedTime) {
        summaryDate.textContent = 'Выберите дату и время';
        return;
    }

    const dayOfWeek = WEEKDAYS_SHORT[state.selectedDay.getDay()];
    const day = state.selectedDay.getDate();
    const month = MONTHS_GENITIVE[state.selectedDay.getMonth()];
    const year = state.selectedDay.getFullYear();

    // Время окончания (+1 час)
    const [hours, minutes] = state.selectedTime.split(':').map(Number);
    const endHours = String(hours + 1).padStart(2, '0');
    const endMinutes = String(minutes).padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}`;

    summaryDate.textContent = `${dayOfWeek}, ${day} ${month} ${year} • ${state.selectedTime}–${endTime}`;
}

// --- Шаг 8. Инициализация ---

function init() {
    // Находим DOM-элементы
    calendarGrid = document.getElementById('calendarGrid');
    timeGrid = document.getElementById('timeGrid');
    monthYearLabel = document.querySelector('.calendar-header h2');
    btnPrev = document.querySelector('.calendar-nav button[aria-label="Предыдущий месяц"]');
    btnNext = document.querySelector('.calendar-nav button[aria-label="Следующий месяц"]');
    summaryDate = document.getElementById('summaryDate');

    if (!calendarGrid || !timeGrid) {
        console.error('Ошибка: не найдены контейнеры #calendarGrid или #timeGrid.');
        return;
    }

    // Инициализация состояния
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    state.currentMonth = today.getMonth();
    state.currentYear = today.getFullYear();
    state.selectedDay = new Date(today);
    state.selectedTime = AVAILABLE_TIMES[0]; // по умолчанию 10:00
    state.slots = [...AVAILABLE_TIMES];

    // Первый рендер
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();

    // Навешиваем обработчики на стрелки
    setupMonthNavigation();

    // Обработчик кнопки «Далее» (переход на шаг 4)
    const btnNextStep = document.querySelector('.btn-primary');
    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            if (!state.selectedDay || !state.selectedTime) {
                alert('Пожалуйста, выберите дату и время.');
                return;
            }
            // Здесь можно сохранить state в sessionStorage и перейти дальше
            console.log('Выбрано:', state.selectedDay, state.selectedTime);
            // window.location.href = '/step-4';
        });
    }
}
