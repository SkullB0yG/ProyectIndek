-- Esta primera parte se encarga del control de acceso y logeo de la aplicacion

PRAGMA foreign_keys = ON;

CREATE TABLE tipos_ususarios(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL UNIQUE
);


CREATE TABLE usuarios(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nombre TEXT NOT NULL,
	contrasena TEXT NOT NULL,
	tipo INTEGER NOT NULL,
	
	-- CREO LA RELACION ENTRE USUARIOS Y TIPOS ESTO ES 1:N ES DECIR UN USUARIO TIENE UN TIPO
	
	FOREIGN KEY (tipo) REFERENCES tipos_usuarios(id)
	
);

CREATE TABLE rutas(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	url TEXT NOT NULL UNIQUE,
	descripcion TEXT
);

CREATE TABLE tipo_ruta(
	tipo_id INTEGER NOT NULL,
	ruta_id INTEGER NOT NULL,
	PRIMARY KEY (tipo_id, ruta_id),
	
	FOREIGN KEY (tipo_id) REFERENCES tipos_usuarios(id) ON DELETE CASCADE,
	FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
	
);

INSERT INTO tipos_ususarios (nombre) 
VALUES ('user');

INSERT  INTO ususarios (nombre, contrasena, tipo)
VALUES ('lmolina', '123456', 2);

INSERT INTO rutas (url, descripcion)
VALUES ('/dashboard', 'Ruta para el panel del usuario normal');


INSERT INTO tipo_ruta (tipo_id, ruta_id)
VALUES (2, 2);

SELECT * FROM rutas;


-- Esta consulta me permite obtener todos los usuarios 

SELECT 
    u.nombre AS usuario,
    u.contrasena AS contrasena,
    t.nombre AS rol,
    r.url AS ruta
FROM ususarios u
JOIN tipos_ususarios t ON u.tipo = t.id
JOIN tipo_ruta tr ON t.id = tr.tipo_id
JOIN rutas r ON tr.ruta_id = r.id;
