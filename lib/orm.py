# Se realiza prueba de coneccion a la base de datos
from lib.connection import db

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
   
#Permite realizar una consulta a la la tabla usuarios
def get_users (credentcials = list) -> list:

    session = db()
    query_user = []
    try:
        usuarios = session.query(Usuario).all()
        for u in usuarios:
            if u.nombre == credentcials[0] and u.contrasena == credentcials[1]:
                query_user.append([u.tipo, True])
        return query_user
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()


# Mapeo de la tabla ruta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
class Rutas(Base):
    __tablename__ = 'rutas'

    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=True, unique=True)
    descripcion = Column(String)

#Permite realizar consulta a las rutas 
def get_path() -> list:

    session = db()
    query_rutas = []
    try:
        rutas = session.query(Rutas).all()
        for r in rutas:
            query_rutas.append([r.id, r.url, r.descripcion])
        return query_rutas
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()
