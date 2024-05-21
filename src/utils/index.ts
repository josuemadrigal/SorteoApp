export function generateSlug(name: string): string {
  return name
    .normalize("NFD") // Normaliza el nombre para descomponer caracteres especiales
    .replace(/[\u0300-\u036f]/g, "") // Elimina las marcas diacríticas (acentos)
    .toLowerCase() // Convierte el nombre a minúsculas
    .replace(/\s+/g, "_"); // Reemplaza los espacios por guiones bajos
}
