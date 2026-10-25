//? Convierte una URL local (el webPath que devuelve Capacitor: blob: en web, capacitor://... en nativo)
//? en un File real, que es lo que se puede subir con FormData (ej. a ImageKit)
export const webPathToFile = async (
  webPath: string,
  fileName: string,
): Promise<File> => {
  const response = await fetch(webPath);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
