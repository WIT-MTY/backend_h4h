INSERT INTO semestre (descripcion) VALUES
('1'),
('2'),
('3'),
('4'),
('5'),
('6'),
('7'),
('8'),
('9'),
('10');

INSERT INTO genero (descripcion) VALUES
('Femenino'),
('Masculino'),
('Otro'),
('Prefiero no decirlo');

INSERT INTO talla_playera (descripcion) VALUES
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL');

INSERT INTO reto (titulo, descripcion) VALUES
('Reto 1', 'Descripción del reto 1'),
('Reto 2', 'Descripción del reto 2');

INSERT INTO nivel_estudio (descripcion) VALUES
('Preparatoria'),
('Licenciatura'),
('Maestría'),
('Doctorado');

INSERT INTO estatus_participante (descripcion) VALUES
('Aceptado'),
('Rechazado'),
('Pendiente');

INSERT INTO estatus_equipo (descripcion) VALUES
('Incompleto'),
('En espera de asignación de reto'),
('Aceptado y asignado a reto'),
('Rechazado');

INSERT INTO usuario_base (email, password_hash) VALUES
('maria.gomez@google.com', 'password1'),
('juan.perez@google.com', 'password2'),
('ana.martinez@google.com', 'password3'),
('carolina.rodriguez@google.com', 'password4');

INSERT INTO participante (
    usuario_base_id, 
    nombre,
    apellido, 
    semestre_id, 
    genero_id, 
    talla_playera_id, 
    opcion1_reto_id, 
    opcion2_reto_id, 
    nivel_estudio_id, 
    estatus_participante_id
) VALUES
(1, 'María', 'Gómez', 6, 1, 2, 2, 1, 3, 1),
(2, 'Juan', 'Pérez', 1, 2, 3, 1, 2, 2, 2),
(3, 'Ana', 'Martínez', 4, 1, 1, 1, 2, 3, 3),
(4, 'Carolina', 'Rodríguez', 3, 3, 4, 2, 1, 3, 3);