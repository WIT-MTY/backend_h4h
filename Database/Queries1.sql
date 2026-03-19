USE hack4her_dev2;

-- ---------------------------------------------------------------------

-- # DE PARTICIPANTES

-- Total
SELECT COUNT(*) AS total_participantes
FROM participante;

-- Por estatus
SELECT ep.descripcion, COUNT(*) AS total
FROM participante p
JOIN estatus_participante ep ON p.estatus_participante_id = ep.id
GROUP BY ep.descripcion;

-- ---------------------------------------------------------------------

-- UNIVERSIDADES

-- Top 10 universidades

SELECT 
  u.universidad_nombre,
  COUNT(*) AS total_participantes
FROM participante p
JOIN universidad u ON p.universidad_id = u.universidad_id
GROUP BY u.universidad_nombre
ORDER BY total_participantes DESC
LIMIT 10;

-- ---------------------------------------------------------------------

-- PAISES

SELECT 
  pa.es AS pais,
  COUNT(*) AS total_participantes
FROM participante p
JOIN pais pa ON p.pais_id = pa.pais_id
GROUP BY pa.es
ORDER BY total_participantes DESC;

-- ESTADOS

SELECT 
  u.nom_ent AS estado,
  COUNT(*) AS total_participantes
FROM participante p
JOIN universidad u ON p.universidad_id = u.universidad_id
GROUP BY u.nom_ent
ORDER BY total_participantes DESC;

-- ---------------------------------------------------------------------

-- INFO PARTICIPANTES (para excel)

SELECT
	p.id,
	p.nombre,
	p.apellido,
	ub.email,
	ep.descripcion AS estatus,
	p.telefono,
	p.fecha_nacimiento,
	p.mayor_edad,
	p.carrera,
	p.linkedin_url,
	p.github_url,
	p.cv_url,
	g.descripcion as genero,
	tp.descripcion as talla_playera
FROM participante p
JOIN usuario_base ub ON p.usuario_base_id = ub.id
LEFT JOIN estatus_participante ep ON p.estatus_participante_id = ep.id
LEFT JOIN genero g ON p.genero_id = g.id
LEFT JOIN talla_playera tp ON p.talla_playera_id = tp.id;

-- ---------------------------------------------------------------------

-- RESTRICCIONES ALIMENTARIAS

-- Total

SELECT COUNT(*) AS total_con_restricciones
FROM participante
WHERE tiene_restriccion_alimentaria = TRUE;

-- Por tipos

SELECT detalle_restriccion_alimentaria, COUNT(*) AS total
FROM participante
WHERE tiene_restriccion_alimentaria = TRUE
GROUP BY detalle_restriccion_alimentaria;

-- ---------------------------------------------------------------------

-- EDADES

-- Promedio

SELECT AVG(TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE())) AS edad_promedio
FROM participante
WHERE fecha_nacimiento IS NOT NULL;

-- Cantidad

SELECT 
  TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad,
  COUNT(*) AS total_personas
FROM participante
WHERE fecha_nacimiento IS NOT NULL
GROUP BY edad
ORDER BY total_personas DESC;

-- Por rangos
SELECT 
  CASE 
    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18 THEN '<18'
    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 18 AND 21 THEN '18-21'
    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 22 AND 25 THEN '22-25'
    ELSE '25+'
  END AS rango_edad,
  COUNT(*) AS total
FROM participante
GROUP BY rango_edad;

-- ---------------------------------------------------------------------

-- SEMESTRES

SELECT s.descripcion, COUNT(*) AS total
FROM participante p
JOIN semestre s ON p.semestre_id = s.id
GROUP BY s.descripcion
ORDER BY s.id;

-- ---------------------------------------------------------------------

-- TALLAS DE PLAYERAS

SELECT tp.descripcion, COUNT(*) AS total
FROM participante p
JOIN talla_playera tp ON p.talla_playera_id = tp.id
GROUP BY tp.descripcion;

-- ---------------------------------------------------------------------

-- REGISTRO vs. ASISTENCIAS

SELECT 
  COUNT(*) AS registrados,
  SUM(registro_d1 = TRUE) AS asistieron,
  ROUND(SUM(registro_d1 = TRUE) / COUNT(*) * 100, 2) AS porcentaje_asistencia
FROM participante;

-- ---------------------------------------------------------------------

-- PARTICIPANTES SIN EQUIPO

SELECT COUNT(*) AS sin_equipo
FROM participante p
LEFT JOIN equipo e 
  ON p.id IN (e.lider_id, e.participante2_id, e.participante3_id, e.participante4_id)
WHERE e.id IS NULL;

-- ---------------------------------------------------------------------

-- TAMAÑO DE EQUIPOS

SELECT 
  id,
  (
    (lider_id IS NOT NULL) +
    (participante2_id IS NOT NULL) +
    (participante3_id IS NOT NULL) +
    (participante4_id IS NOT NULL)
  ) AS tamaño_equipo
FROM equipo;

-- ---------------------------------------------------------------------

-- PARTICIPANTES INCOMPLETOS

SELECT COUNT(*) AS incompletos
FROM participante
WHERE 
  nombre IS NULL OR
  apellido IS NULL OR
  carrera IS NULL OR
  semestre_id IS NULL;

-- ---------------------------------------------------------------------

-- VALIDACIONES PENDIENTES

SELECT COUNT(*) AS Pendiente
FROM participante
WHERE fecha_validacion IS NULL;

-- ---------------------------------------------------------------------
