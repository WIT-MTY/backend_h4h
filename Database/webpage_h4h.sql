-- =========================
-- CATÁLOGOS
-- =========================

CREATE TABLE estatus_participante (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE estatus_equipo (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE reto (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE semestre (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE genero (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE nivel_estudio (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(100)
);

CREATE TABLE talla_playera (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(20)
);

-- =========================
-- USUARIOS
-- =========================

CREATE TABLE usuario_base (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE administrador (
  id SERIAL PRIMARY KEY,
  usuario_base_id INTEGER UNIQUE NOT NULL,
  FOREIGN KEY (usuario_base_id) REFERENCES usuario_base(id)
);

CREATE TABLE participante (
  id SERIAL PRIMARY KEY,
  usuario_base_id INTEGER UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  estatus_participante_id INTEGER DEFAULT 1,
  fecha_nacimiento DATE,
  mayor_edad BOOLEAN,
  permiso_menoredad VARCHAR(255),
  telefono VARCHAR(30),
  escuela VARCHAR(255),
  lugar_residencia VARCHAR(255),
  nivel_estudio_id INTEGER,
  semestre_id INTEGER,
  carrera VARCHAR(255),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  cv_url VARCHAR(255),
  genero_id INTEGER,
  tiene_restriccion_alimentaria BOOLEAN DEFAULT FALSE,
  detalle_restriccion_alimentaria VARCHAR(255),
  talla_playera_id INTEGER,
  fecha_validacion TIMESTAMP,
  comentarios_validacion VARCHAR(255),
  opcion1_reto_id INTEGER,
  opcion2_reto_id INTEGER,

  FOREIGN KEY (usuario_base_id) REFERENCES usuario_base(id),
  FOREIGN KEY (estatus_participante_id) REFERENCES estatus_participante(id),
  FOREIGN KEY (opcion1_reto_id) REFERENCES reto(id),
  FOREIGN KEY (opcion2_reto_id) REFERENCES reto(id),
  FOREIGN KEY (semestre_id) REFERENCES semestre(id),
  FOREIGN KEY (genero_id) REFERENCES genero(id),
  FOREIGN KEY (talla_playera_id) REFERENCES talla_playera(id),
  FOREIGN KEY (nivel_estudio_id) REFERENCES nivel_estudio(id)
);

-- =========================
-- EQUIPOS
-- =========================

CREATE TABLE equipo (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE NOT NULL,
  codigo_equipo VARCHAR(50) UNIQUE NOT NULL,
  estatus_equipo_id INTEGER DEFAULT 1,
  reto_asignado_id INTEGER,
  opcion1_reto_id INTEGER,
  opcion2_reto_id INTEGER,
  lider_id INTEGER,
  participante2_id INTEGER,
  participante3_id INTEGER,
  participante4_id INTEGER,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_validacion TIMESTAMP,

  FOREIGN KEY (estatus_equipo_id) REFERENCES estatus_equipo(id),
  FOREIGN KEY (reto_asignado_id) REFERENCES reto(id),
  FOREIGN KEY (opcion1_reto_id) REFERENCES reto(id),
  FOREIGN KEY (opcion2_reto_id) REFERENCES reto(id),
  FOREIGN KEY (lider_id) REFERENCES participante(id),
  FOREIGN KEY (participante2_id) REFERENCES participante(id),
  FOREIGN KEY (participante3_id) REFERENCES participante(id),
  FOREIGN KEY (participante4_id) REFERENCES participante(id)
);

CREATE TABLE codigos_equipo (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  usado BOOLEAN DEFAULT FALSE,
  team_id INTEGER,
  FOREIGN KEY (team_id) REFERENCES equipo(id)
);