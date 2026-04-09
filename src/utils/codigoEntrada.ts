export function generarCodigoEntrada(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.floor(Math.random() * 36 ** 2).toString(36);

  return (timestamp + random).toUpperCase().slice(-6);
}
