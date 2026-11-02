def is_valid_appointment(client_name, master_id, service_id, time) -> bool:
    return (
        isinstance(client_name, str) and client_name.strip() != ""
        and master_id is not None
        and service_id is not None
        and isinstance(time, str) and time.strip() != ""
    )
