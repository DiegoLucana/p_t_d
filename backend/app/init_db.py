from sqlalchemy.orm import Session

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.core.security import get_password_hash


ADMIN_EMAIL = "diegolucana@cpatbus.com"
ADMIN_PASSWORD = "cpatbus123"
ADMIN_NAME = "Diego Lucana"


def init_db() -> None:
    # 1. Crear tablas a partir de los modelos
    print("🔧 Creando tablas en la base de datos (si no existen)...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas o ya existentes.")

    # 2. Crear usuario admin por defecto
    db: Session = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if admin:
            print(f"ℹ️  Usuario admin ya existe: {ADMIN_EMAIL}")
        else:
            print(f"👤 Creando usuario admin: {ADMIN_EMAIL}")
            admin = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password_hash=get_password_hash(ADMIN_PASSWORD),
                role="admin",
                is_active=True,
            )
            db.add(admin)
            db.commit()
            print("✅ Usuario admin creado correctamente.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
