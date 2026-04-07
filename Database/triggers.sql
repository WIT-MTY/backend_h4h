-- PUBLIC SCHEME
SET search_path TO public;

CREATE OR REPLACE FUNCTION validar_equipo_completo()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.participante4_id IS NULL AND NEW.participante4_id IS NOT NULL THEN
    NEW.fecha_validacion := NOW();
    NEW.estatus_equipo_id :=3;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_equipo_completo ON equipo;
CREATE TRIGGER trigger_equipo_completo
BEFORE UPDATE ON equipo
FOR EACH ROW
EXECUTE FUNCTION validar_equipo_completo();


-- DEV SCHEME
SET search_path TO dev;

CREATE OR REPLACE FUNCTION dev.validar_equipo_completo()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.participante4_id IS NULL AND NEW.participante4_id IS NOT NULL THEN
    NEW.fecha_validacion := NOW();
    NEW.estatus_equipo_id :=3;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_equipo_completo ON dev.equipo;
CREATE TRIGGER trigger_equipo_completo
BEFORE UPDATE ON dev.equipo
FOR EACH ROW
EXECUTE FUNCTION dev.validar_equipo_completo();