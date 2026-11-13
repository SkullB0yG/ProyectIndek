from pathlib import Path
from sqlalchemy import create_engine

# Obtiene la ruta correcta sin importar si es windows o linux
database = Path("database.db").resolve()

def db():
    engine = create_engine(f"sqlite:///{database.as_posix()}")
    return engine

