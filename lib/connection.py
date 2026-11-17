from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Obtiene la ruta correcta sin importar si es windows o linux

# Para que esto funcion tiene que estar en la carpeta raiz del proyecto de otra forma no funcionara 
database = Path("database.db").resolve()
engine = create_engine(f"sqlite:///{database.as_posix()}")
session = sessionmaker(bind=engine)


def db():
    return session()



