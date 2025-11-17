from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.router import api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
    )

    origins = [
        "http://localhost:4028",  # tu frontend React
        "http://localhost:3000",
        "http://127.0.0.1:4028",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Servir archivos estáticos (videos procesados, etc.)
    app.mount("/media", StaticFiles(directory="media"), name="media")

    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    return app


app = create_app()
