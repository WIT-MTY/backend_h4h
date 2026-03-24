CREATE OR REPLACE VIEW dev.view_paises AS
SELECT
  id AS value,
  nom_pais AS label
FROM dev.pais
ORDER BY nom_pais;

CREATE OR REPLACE VIEW dev.view_estados AS
SELECT
  id AS value,
  nom_estado AS label
FROM dev.estado
ORDER BY nom_estado;

CREATE OR REPLACE VIEW dev.view_universidades AS
SELECT
  u.id AS value,
  u.universidad_nombre AS label,
  e.nom_estado AS estado
FROM dev.universidad u
JOIN dev.estado e
  ON u.estado_id = e.id
ORDER BY u.universidad_nombre;

CREATE OR REPLACE VIEW dev.view_genero AS
SELECT
  id AS value,
  descripcion AS label
FROM dev.genero
ORDER BY descripcion;

CREATE OR REPLACE VIEW dev.view_tallas AS
SELECT
  id AS value,
  descripcion as label
FROM dev.talla_playera
ORDER BY id;

CREATE OR REPLACE VIEW dev.view_carreras AS
SELECT
  id AS value,
  carrera_nombre AS label
FROM dev.carrera
ORDER BY carrera_nombre;

CREATE OR REPLACE VIEW dev.view_semestres AS
SELECT
  id AS value,
  descripcion AS label
FROM dev.semestre
ORDER BY id;