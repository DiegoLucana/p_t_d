from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "CPatBus Backend"
    API_V1_PREFIX: str = "/api/v1"

    # DB
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "cpatbus_user"
    POSTGRES_PASSWORD: str = "cpatbus_pass"
    POSTGRES_DB: str = "cpatbus_db"

    SQLALCHEMY_DATABASE_URI: str | None = None

    # JWT
    SECRET_KEY: str = "CHANGE_ME_SUPER_SECRET"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 día
    ALGORITHM: str = "HS256"

    # Redis (para caching tiempo real)
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"

    def init_db_uri(self):
        if not self.SQLALCHEMY_DATABASE_URI:
            self.SQLALCHEMY_DATABASE_URI = (
                f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )


settings = Settings()
settings.init_db_uri()
