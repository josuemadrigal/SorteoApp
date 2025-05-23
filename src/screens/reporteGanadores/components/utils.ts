export const formatPremio = (premio: string) => {
  const premiosMap: Record<string, string> = {
    abanico: "Abanico",
    televisor: "Televisor",
    nevera: "Nevera",
    microondas: "Microondas",
    lavadora: "Lavadora",
    freidora: "Freidora",
    licuadora: "Licuadora",
    "olla-de-presion": "Olla de presión",
    "estufa-de-mesa-4-hornillas": "Estufa de Mesa 4 hornillas",
    "estufa-de-horno": "Estufa de horno",
    "cilindro-de-gas-50lb": "Cilindro de gas 50LB",
    "juego-de-ollas": "Juego de Ollas",
    "bono-de-rd1500-pesos": "Bono de RD$1,500",
    "bono-de-rd2000-pesos": "Bono de RD$2,000",
  };
  return premiosMap[premio] || premio;
};

export const colorPremio = (premio: string) => {
  const premiosMap: Record<string, string> = {
    abanico: "bg-sky-300",
    televisor: "bg-amber-300",
    nevera: "bg-rose-300",
    microondas: "bg-teal-300",
    lavadora: "bg-lime-300",
    freidora: "bg-gray-300",
    licuadora: "bg-purple-300",
    "olla-de-presion": "bg-orange-300",
    "estufa-de-mesa-4-hornillas": "bg-cyan-300",
    "estufa-de-horno": "bg-red-300",
    "cilindro-de-gas-50lb": "bg-fuchsia-300",
    "juego-de-ollas": "bg-yellow-300",
    "bono-de-rd1500-pesos": "bg-violet-300",
    "bono-de-rd2000-pesos": "bg-blue-300",
  };
  return premiosMap[premio] || premio;
};

export const getContrastTextColor = (
  bgColor: [number, number, number]
): [number, number, number] => {
  // Fórmula de luminosidad para determinar contraste
  const luminance =
    (0.299 * bgColor[0] + 0.587 * bgColor[1] + 0.114 * bgColor[2]) / 255;
  return luminance > 0.5 ? [0, 0, 0] : [255, 255, 255]; // Negro o blanco
};
