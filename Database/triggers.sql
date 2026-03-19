
DROP TRIGGER IF EXISTS trg_participante_mayor_edad_insert;
DROP TRIGGER IF EXISTS trg_participante_mayor_edad_update;

DELIMITER $$

CREATE TRIGGER trg_participante_mayor_edad_insert
BEFORE INSERT ON participante
FOR EACH ROW
BEGIN
  IF NEW.fecha_nacimiento IS NOT NULL THEN
    SET NEW.mayor_edad = 
      TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE()) >= 18;
  END IF;
END$$

-- Si se realizan cambios en la fecha de nacimiento, también se debe actualizar el campo mayor_edad
CREATE TRIGGER trg_participante_mayor_edad_update
BEFORE UPDATE ON participante
FOR EACH ROW
BEGIN
  IF NEW.fecha_nacimiento IS NOT NULL THEN
    SET NEW.mayor_edad = 
      TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE()) >= 18;
  END IF;
END$$

DELIMITER ;