# Se realiza prueba de coneccion a la base de datos
from Connection import db

# Esto me permite mapear las tablas
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String


Base = declarative_base()


# Mapeo de la tbala usuarios
class Usuario(Base):
    __tablename__ = 'ususarios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=True)
    contrasena = Column(String, nullable=True)
    tipo = Column(Integer, nullable=True)


# Mapeo de la tabla ruta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
class Rutas(Base):
    __tablename__ = 'rutas'

    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=True, unique=True)
    descripcion = Column(String)


#Permite realizar consulta a las rutas 
def get_path():

    session = db()
    try:
        rutas = session.query(Rutas).all()
        for r in rutas:
            print(f"{r.id} {r.url} {r.descripcion}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()
    

#Permite realizar una consulta a la la tabla usuarios
def get_users ():

    session = db()
    try:
        usuarios = session.query(Usuario).all()
        for u in usuarios:
            print(f"{u.id}, {u.nombre} {u.contrasena} {u.tipo}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()

get_path()
get_users()