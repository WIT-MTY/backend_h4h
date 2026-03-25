-- Compatible con .rpc("fn_registro_participantes", {});
CREATE OR REPLACE FUNCTION fn_registro_participantes(
    p_usuario_base_id UUID,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_permisos_menores_url VARCHAR(255),
    p_telefono VARCHAR(20),
    p_pais_id INT,
    p_universidad_mexico_id INT,
    p_universidad_extranjera VARCHAR(100),
    p_estado_id INT,
    p_semestre_id INT,
    p_carrera_id INT,
    p_linkedin_url VARCHAR(255),
    p_github_url VARCHAR(255),
    p_cv_url VARCHAR(255),
    p_genero_id INT,
    p_vegana BOOLEAN,
    p_tiene_restriccion_alimentaria BOOLEAN,
    p_desc_restricciones_alimenticias VARCHAR(255),
    p_talla_id INT
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_edad INT;
    v_estatus_pendiente_id INT;
BEGIN
    -- 1. Calcular la edad basada en la fecha de nacimiento
    v_edad := EXTRACT(YEAR FROM age(CURRENT_DATE, p_fecha_nacimiento));

    -- 2. Validación de mayoría de edad y URL de permiso
    IF v_edad < 18 THEN
        IF p_permisos_menores_url IS NULL OR TRIM(p_permisos_menores_url) = '' THEN
            RAISE EXCEPTION 'El participante es menor de edad (% años) y se requiere la URL del permiso de los padres.', v_edad;
        END IF;
    END IF;

    -- 3. Validación de github_url
    IF p_github_url IS NULL OR TRIM(p_github_url) = '' THEN
        RAISE EXCEPTION 'Se requiere la URL del perfil de GitHub.';
    END IF;

    -- 4. Validación de cv_url
    IF p_cv_url IS NULL OR TRIM(p_cv_url) = '' THEN
        RAISE EXCEPTION 'Se requiere la URL del CV.';
    END IF;

    -- 5. Validación de pais_id
    IF p_pais_id IS NULL THEN
        RAISE EXCEPTION 'Se requiere el ID del país.';
    END IF;
    
    -- 6. Validación de universidad
    IF p_universidad_mexico_id IS NULL AND (p_universidad_extranjera IS NULL OR TRIM(p_universidad_extranjera) = '') THEN
        RAISE EXCEPTION 'Se requiere el ID de la universidad en México o el nombre de la universidad extranjera.';
    END IF;

    -- 7. Obtener el ID del estatus 'Pendiente'
    SELECT id INTO v_estatus_pendiente_id 
    FROM dev.estatus_participante 
    WHERE descripcion = 'Pendiente' 
    LIMIT 1;

    -- 8. Inserción (Si llega aquí es porque pasó la validación de edad)
    INSERT INTO dev.participante (
        usuario_base_id,
        nombre,
        apellido,
        fecha_nacimiento,
        permiso_menoredad,
        telefono,
        pais_id,
        universidad_mexico_id,
        universidad_extranjera,
        estado_id,
        semestre_id,
        carrera_id,
        linkedin_url,
        github_url,
        cv_url,
        genero_id,
        vegana,
        tiene_restriccion_alimentaria,
        detalle_restriccion_alimentaria,
        talla_playera_id,
        estatus_participante_id
    )
    VALUES (
        p_usuario_base_id,
        p_nombre,
        p_apellido,
        p_fecha_nacimiento,
        p_permisos_menores_url,
        p_telefono,
        p_pais_id,
        p_universidad_mexico_id,
        p_universidad_extranjera,
        p_estado_id,
        p_semestre_id,
        p_carrera_id,
        p_linkedin_url,
        p_github_url,
        p_cv_url,
        p_genero_id,
        COALESCE(p_vegana, FALSE), -- Default false
        COALESCE(p_tiene_restriccion_alimentaria, FALSE), -- Default false
        COALESCE(p_desc_restricciones_alimenticias, ''), -- Default empty string
        p_talla_id,
        v_estatus_pendiente_id -- Pendiente
    );

END;
$$;

-- Compatible con .query(`CALL sp_registro_participantes(...)`);
CREATE OR REPLACE PROCEDURE sp_registro_participantes(
    p_usuario_base_id UUID,
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_fecha_nacimiento DATE,
    p_permisos_menores_url VARCHAR(255),
    p_telefono VARCHAR(20),
    p_pais_id INT,
    p_universidad_mexico_id INT,
    p_universidad_extranjera VARCHAR(100),
    p_estado_id INT,
    p_semestre_id INT,
    p_carrera_id INT,
    p_linkedin_url VARCHAR(255),
    p_github_url VARCHAR(255),
    p_cv_url VARCHAR(255),
    p_genero_id INT,
    p_vegana BOOLEAN,
    p_tiene_restriccion_alimentaria BOOLEAN,
    p_desc_restricciones_alimenticias VARCHAR(255),
    p_talla_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_edad INT;
    v_estatus_pendiente_id INT;
BEGIN
    -- 1. Calcular la edad basada en la fecha de nacimiento
    v_edad := EXTRACT(YEAR FROM age(CURRENT_DATE, p_fecha_nacimiento));

    -- 2. Validación de mayoría de edad y URL de permiso
    IF v_edad < 18 THEN
        IF p_permisos_menores_url IS NULL OR TRIM(p_permisos_menores_url) = '' THEN
            RAISE EXCEPTION 'El participante es menor de edad (% años) y se requiere la URL del permiso de los padres.', v_edad;
        END IF;
    END IF;

    -- 3. Validación de github_url
    IF p_github_url IS NULL OR TRIM(p_github_url) = '' THEN
        RAISE EXCEPTION 'Se requiere la URL del perfil de GitHub.';
    END IF;

    -- 4. Validación de cv_url
    IF p_cv_url IS NULL OR TRIM(p_cv_url) = '' THEN
        RAISE EXCEPTION 'Se requiere la URL del CV.';
    END IF;

    -- 5. Validación de pais_id
    IF p_pais_id IS NULL THEN
        RAISE EXCEPTION 'Se requiere el ID del país.';
    END IF;
    
    -- 6. Validación de universidad
    IF p_universidad_mexico_id IS NULL AND (p_universidad_extranjera IS NULL OR TRIM(p_universidad_extranjera) = '') THEN
        RAISE EXCEPTION 'Se requiere el ID de la universidad en México o el nombre de la universidad extranjera.';
    END IF;

    -- 7. Obtener el ID del estatus 'Pendiente'
    SELECT id INTO v_estatus_pendiente_id 
    FROM dev.estatus_participante 
    WHERE descripcion = 'Pendiente' 
    LIMIT 1;

    -- 8. Inserción (Si llega aquí es porque pasó la validación de edad)
    INSERT INTO dev.participante (
        usuario_base_id,
        nombre,
        apellido,
        fecha_nacimiento,
        permiso_menoredad,
        telefono,
        pais_id,
        universidad_mexico_id,
        universidad_extranjera,
        estado_id,
        semestre_id,
        carrera_id,
        linkedin_url,
        github_url,
        cv_url,
        genero_id,
        vegana,
        tiene_restriccion_alimentaria,
        detalle_restriccion_alimentaria,
        talla_playera_id,
        estatus_participante_id
    )
    VALUES (
        p_usuario_base_id,
        p_nombre,
        p_apellido,
        p_fecha_nacimiento,
        p_permisos_menores_url,
        p_telefono,
        p_pais_id,
        p_universidad_mexico_id,
        p_universidad_extranjera,
        p_estado_id,
        p_semestre_id,
        p_carrera_id,
        p_linkedin_url,
        p_github_url,
        p_cv_url,
        p_genero_id,
        COALESCE(p_vegana, FALSE), -- Default false
        COALESCE(p_tiene_restriccion_alimentaria, FALSE), -- Default false
        COALESCE(p_desc_restricciones_alimenticias, ''), -- Default empty string
        p_talla_id,
        v_estatus_pendiente_id -- Pendiente
    );

END;
$$;


-- Ejemplo de uso:
CALL extensions.sp_registro_participantes(
    '2f6bb90b-7642-4ac9-bdca-0cea2084e503',-- p_usuario_base_id (UUID)
    'Dana',                                -- p_nombre
    'Torres',                              -- p_apellido
    '2005-07-24',                          -- p_fecha_nacimiento
    NULL,                                  -- p_permisos_menores_url (es mayor de edad)
    '+525512345678',                       -- p_telefono
    141,                                   -- p_pais_id (México)
    463,                                   -- p_universidad_mexico_id (Tecnológico de Monterrey, Campus Monterrey)
    NULL,                                  -- p_universidad_extranjera
    5,                                     -- p_estado_id
    3,                                     -- p_semestre_id
    12,                                    -- p_carrera_id
    'https://www.linkedin.com/in/dana-elizabeth-torres-estrada-b20b2b329/',   -- p_linkedin_url
    'https://github.com/BlueE-05',         -- p_github_url
    'url',                                 -- p_cv_url
    1,                                     -- p_genero_id
    FALSE,                                 -- p_vegana
    TRUE,                                  -- p_tiene_restriccion_alimentaria
    'Alérgica al aguacate',                -- p_desc_restricciones_alimenticias
    1                                      -- p_talla_id
);