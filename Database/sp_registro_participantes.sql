-- Compatible con .rpc("fn_registro_participantes", {});
CREATE OR REPLACE FUNCTION public.fn_registro_participantes(
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

    -- 3. Validación de cv_url
    IF p_cv_url IS NULL OR TRIM(p_cv_url) = '' THEN
        RAISE EXCEPTION 'Se requiere la URL del CV.';
    END IF;

    -- 4. Validación de pais_id
    IF p_pais_id IS NULL THEN
        RAISE EXCEPTION 'Se requiere el ID del país.';
    END IF;
    
    -- 5. Validación de universidad
    IF p_universidad_mexico_id IS NULL AND (p_universidad_extranjera IS NULL OR TRIM(p_universidad_extranjera) = '') THEN
        RAISE EXCEPTION 'Se requiere el ID de la universidad en México o el nombre de la universidad extranjera.';
    END IF;

    -- 6. Obtener el ID del estatus 'Pendiente'
    SELECT id INTO v_estatus_pendiente_id 
    FROM dev.estatus_participante 
    WHERE descripcion = 'Pendiente' 
    LIMIT 1;

    -- 7. Inserción (Si llega aquí es porque pasó la validación de edad)
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

--* REVISAR SI ESTO CONLLEVA RIESGOS DE SEGURIDAD, SI ES ASÍ, CONSIDERAR CREAR UNA FUNCIÓN INTERMEDIA QUE VERIFIQUE LOS PERMISOS Y LUEGO LLAME A ESTA FUNCIÓN DE INSERCIÓN
-- PARTE A: Abrir el esquema 'dev' para el administrador
GRANT USAGE ON SCHEMA dev TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dev TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dev TO service_role;

-- PARTE B: Blindar la función (SECURITY DEFINER)
-- Esto hace que la función use los permisos del creador (postgres), saltándose RLS
ALTER FUNCTION public.fn_registro_participantes(uuid, varchar, varchar, date, varchar, varchar, int, int, varchar, int, int, int, varchar, varchar, varchar, int, boolean, boolean, varchar, int) 
SECURITY DEFINER;

-- PARTE C: Restringir quién puede llamar a la función
REVOKE EXECUTE ON FUNCTION public.fn_registro_participantes(uuid, varchar, varchar, date, varchar, varchar, int, int, varchar, int, int, int, varchar, varchar, varchar, int, boolean, boolean, varchar, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fn_registro_participantes(uuid, varchar, varchar, date, varchar, varchar, int, int, varchar, int, int, int, varchar, varchar, varchar, int, boolean, boolean, varchar, int) TO service_role;
--*