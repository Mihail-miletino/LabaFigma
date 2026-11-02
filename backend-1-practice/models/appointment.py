class Appointment:
    def __init__(self, client_name: str, master_id: int, service_id: int, time: str):
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self):
        return f"Appointment(client_name={self.client_name!r}, time={self.time!r})"
