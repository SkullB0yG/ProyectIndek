from Connection import db
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

# Se realiza prueba de coneccion a la base de datos

Base = declarative_base()


class Usuario(Base):
    __tablename__ = 'ususarios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=True)
    contrasena = Column(String, nullable=True)
    tipo = Column(Integer, nullable=True)



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
    

