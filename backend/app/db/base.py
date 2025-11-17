from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Importa modelos aquí para que Alembic los detecte luego (si usas Alembic)
from app.models import user, bus, route, bus_assignment, occupancy_event, bus_state, validation, system_log  # noqa
