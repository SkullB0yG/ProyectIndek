# Se realiza prueba de coneccion a la base de datos
from lib.connection import db

# Esto me permite mapear las tablas
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String


Base = declarative_base()


# Mapeo de la tabla ruta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
class Rutas(Base):
    __tablename__ = 'rutas'

    id = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String(50), nullable=True, unique=True)
    descripcion = Column(String(50), nullable=True)



# Mapeo de la tabla usuarios
class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(10), nullable=True)
    contrasena = Column(String(255), nullable=True)
    tipo = Column(Integer, nullable=False)