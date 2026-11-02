from services.create_appointment import create_appointment
from utils.data import appointments


first_appointment = create_appointment("Иванова А.А.", 1, 1, '10:00')
second_appointment = create_appointment("Петрова А.А.", 1, 1, '11:00')

no_correct_appointment = create_appointment("", 1, 1, '12:00')
print(no_correct_appointment)        # None
print(len(appointments))             # 2 — запись не добавилась

print("Список записей:")
for appointment in appointments:
    print(appointment.client_name, appointment.time)
