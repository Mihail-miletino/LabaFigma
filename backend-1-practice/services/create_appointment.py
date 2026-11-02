from models.appointment import Appointment
from utils.is_valid_appointment import is_valid_appointment
from utils.data import appointments


def create_appointment(client_name: str,
                       master_id: int,
                       service_id: int,
                       time: str,
) -> Appointment | None:
    if not is_valid_appointment(client_name, master_id, service_id, time):
        return None

    if master_id is None or service_id is None:
        return None

    appointment = Appointment(
        client_name=client_name.strip(),
        master_id=master_id,
        service_id=service_id,
        time=time,
    )
    appointment.id = len(appointments) + 1
    appointments.append(appointment)
    return appointment
