import * as catalogoRepository from "./catalogo.repository.js";

export const obtenerSemestres = async () => {
  return await catalogoRepository.getSemestres();
};
