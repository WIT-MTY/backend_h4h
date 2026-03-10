CREATE OR REPLACE FUNCTION crear_participante(
    p_email TEXT,
    p_nombre TEXT,
    p_apellido TEXT,
    p_fecha_nacimiento TEXT,
    p_mayor_edad TEXT,
    p_permiso_menoredad TEXT,
    p_telefono TEXT,
    p_escuela TEXT,
    p_lugar_residencia TEXT,
    p_nivel_estudio_id TEXT,
    p_semestre_id TEXT,
    p_carrera TEXT,
    p_linkedin_url TEXT,
    p_github_url TEXT,
    p_cv_url TEXT,
    p_genero_id TEXT,
    p_tiene_restriccion_alimentaria TEXT,
    p_detalle_restriccion_alimentaria TEXT,
    p_talla_playera_id TEXT,
    p_opcion1_reto_id TEXT,
    p_opcion2_reto_id TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_base_id INTEGER;
    v_participante_id INTEGER;
BEGIN

    -- Find usuario_base by email
    SELECT id
    INTO v_usuario_base_id
    FROM usuario_base
    WHERE email = p_email;

    IF v_usuario_base_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con email % no existe', p_email;
    END IF;

    -- Insert participante
    INSERT INTO participante (
        usuario_base_id,
        nombre,
        apellido,
        fecha_nacimiento,
        mayor_edad,
        permiso_menoredad,
        telefono,
        escuela,
        lugar_residencia,
        nivel_estudio_id,
        semestre_id,
        carrera,
        linkedin_url,
        github_url,
        cv_url,
        genero_id,
        tiene_restriccion_alimentaria,
        detalle_restriccion_alimentaria,
        talla_playera_id,
        opcion1_reto_id,
        opcion2_reto_id
    )
    VALUES (
        v_usuario_base_id,
        p_nombre,
        p_apellido,
        p_fecha_nacimiento::DATE,
        p_mayor_edad::BOOLEAN,
        p_permiso_menoredad,
        p_telefono,
        p_escuela,
        p_lugar_residencia,
        p_nivel_estudio_id::INTEGER,
        p_semestre_id::INTEGER,
        p_carrera,
        p_linkedin_url,
        p_github_url,
        p_cv_url,
        p_genero_id::INTEGER,
        p_tiene_restriccion_alimentaria::BOOLEAN,
        p_detalle_restriccion_alimentaria,
        p_talla_playera_id::INTEGER,
        p_opcion1_reto_id::INTEGER,
        p_opcion2_reto_id::INTEGER
    )
    RETURNING id INTO v_participante_id;

    RETURN v_participante_id;

END;
$$;


/*
SELECT crear_participante(
'ana@email.com',
'Ana',
'Lopez',
'2003-05-10',
'true',
NULL,
'8112345678',
'ITESM',
'Monterrey',
'1',
'3',
'Ingenieria',
'https://linkedin.com/ana',
'https://github.com/ana',
NULL,
'2',
'false',
NULL,
'3',
'1',
'2'
);
*/