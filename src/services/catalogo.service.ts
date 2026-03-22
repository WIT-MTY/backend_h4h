import * as catalogoRepository from "./catalogo/catalogo.repository.js";

export const obtenerSemestres = async () => {
  return await catalogoRepository.getSemestres();
};
