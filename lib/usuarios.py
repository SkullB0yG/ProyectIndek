# Se realiza prueba de coneccion a la base de datos
from lib.connection import db
from lib.field import Usuario, Rutas
from werkzeug.security import generate_password_hash, check_password_hash

# Esto me permite importar las excepciones de sqlalchemy
from sqlalchemy.exc import IntegrityError


   
#Permite realizar una consulta a la la tabla usuarios
def ValidataionLogin (credentials = list) -> list:

    session = db()
    query_user = []


    try:
        usuarios = session.query(Usuario).filter_by(nombre=credentials[0]).first()
        if usuarios.nombre == credentials[0]:
            print(f"{usuarios.nombre}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        session.close()
    return query_user


# Permite la creacion de usuarios por medio de pasarle datos de un formulario en el frontend
# Adicionalmente me permite crear un hash para cifrar la ciontraseña y no manejar datos sin cifrar en la base de datos esto por seguridad
def CreateUser(nombre = str, contrasena = str, tipo = int) -> bool:
    session = db()

    passwordHashed = generate_password_hash(contrasena)

    dataNewUser = Usuario(nombre = nombre, contrasena = passwordHashed, tipo = tipo)
    newUser = session.add(dataNewUser)

    try:
        #Confirmar para guardar en la BD
        session.commit()
        # Refresca los cambios de la BD
        session.refresh(newUser)
        print(f"El usuario {newUser.id}")
    except IntegrityError as e:
        # Esta lina me permite realizar una reversa a los cambios malos 
        session.rollback()


#Permite realizar consulta a las rutas 
""" def get_path() -> list:

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


ValidataionLogin(credentials=['kojeda','12345']) """

def Hola():
    ususario = "Hola"
    hash_user = generate_password_hash(ususario)
    print(hash_user)
    print(type(hash_user))
    result = check_password_hash(hash_user, 'monda')


    print(result)