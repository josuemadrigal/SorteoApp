// components/ActaEntregaPDF.tsx
import { jsPDF } from "jspdf";
import { loadImage } from "../../reporteGanadores/components/utils";

interface PDFData {
  nombre: string;
  cedula: string;
  premio: string;
  fecha?: string;
  organizacion?: string;
  programa?: string;
  representante?: string;
  cargo?: string;
  valorPremio?: string;
  ciudad?: string;
  numeroActa?: string;
  municipio?: string;
}

interface PDFTheme {
  name: string;
  colors: {
    primary: [number, number, number];
    secondary: [number, number, number];
    accent: [number, number, number];
    text: [number, number, number];
    lightGray: [number, number, number];
    background: [number, number, number];
  };
  gradients: {
    header: [[number, number, number], [number, number, number]];
  };
}

const THEMES: Record<string, PDFTheme> = {
  corporate: {
    name: "Corporativo",
    colors: {
      primary: [0, 150, 72],
      secondary: [71, 85, 105],
      accent: [5, 43, 26],
      text: [15, 23, 42],
      lightGray: [248, 250, 252],
      background: [255, 255, 255],
    },
    gradients: {
      header: [
        [0, 150, 72],
        [102, 209, 153],
      ],
    },
  },
  elegant: {
    name: "Elegante",
    colors: {
      primary: [55, 48, 163],
      secondary: [100, 116, 139],
      accent: [139, 92, 246],
      text: [30, 41, 59],
      lightGray: [250, 250, 255],
      background: [255, 255, 255],
    },
    gradients: {
      header: [
        [55, 48, 163],
        [139, 92, 246],
      ],
    },
  },
  professional: {
    name: "Profesional",
    colors: {
      primary: [17, 24, 39],
      secondary: [75, 85, 99],
      accent: [34, 197, 94],
      text: [31, 41, 55],
      lightGray: [249, 250, 251],
      background: [255, 255, 255],
    },
    gradients: {
      header: [
        [17, 24, 39],
        [75, 85, 99],
      ],
    },
  },
};

export const generarActaEntregaPDF = async (
  data: PDFData,
  themeName: keyof typeof THEMES = "corporate"
) => {
  const theme = THEMES[themeName];
  const doc = new jsPDF({
    unit: "mm",
    format: "letter",
    orientation: "portrait",
  });

  const CONFIG = {
    pageWidth: 215.9,
    pageHeight: 279.4,
    margin: 20,
    contentWidth: 175.9,
    fonts: {
      title: { size: 22, weight: "bold" as const },
      subtitle: { size: 16, weight: "bold" as const },
      body: { size: 11, weight: "normal" as const },
      small: { size: 9, weight: "normal" as const },
      tiny: { size: 8, weight: "normal" as const },
    },
  };

  // Utilidades para diseño
  const setColor = (color: [number, number, number]) => {
    doc.setTextColor(color[0], color[1], color[2]);
  };

  const setDrawColor = (color: [number, number, number]) => {
    doc.setDrawColor(color[0], color[1], color[2]);
  };

  const setFillColor = (color: [number, number, number]) => {
    doc.setFillColor(color[0], color[1], color[2]);
  };

  const centerText = (
    text: string,
    y: number,
    fontSize: number,
    fontWeight: string = "normal"
  ) => {
    doc.setFont("helvetica", fontWeight);
    doc.setFontSize(fontSize);
    doc.text(text, CONFIG.pageWidth / 2, y, { align: "center" });
  };

  const createGradientHeader = (y: number, height: number) => {
    const steps = 20;
    const stepHeight = height / steps;
    const [startColor, endColor] = theme.gradients.header;

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(
        startColor[0] + (endColor[0] - startColor[0]) * ratio
      );
      const g = Math.round(
        startColor[1] + (endColor[1] - startColor[1]) * ratio
      );
      const b = Math.round(
        startColor[2] + (endColor[2] - startColor[2]) * ratio
      );

      doc.setFillColor(r, g, b);
      doc.rect(0, y + i * stepHeight, CONFIG.pageWidth, stepHeight, "F");
    }
  };

  const createDecorativePattern = (x: number, y: number, width: number) => {
    setDrawColor(theme.colors.accent);
    doc.setLineWidth(0.5);

    const patternHeight = 2;
    const steps = Math.floor(width / 4);

    for (let i = 0; i < steps; i++) {
      const startX = x + i * 4;
      const opacity = Math.sin((i / steps) * Math.PI);

      doc.setDrawColor(
        theme.colors.accent[0],
        theme.colors.accent[1],
        theme.colors.accent[2]
      );

      if (i % 2 === 0) {
        doc.line(startX, y, startX + 2, y);
      } else {
        doc.circle(startX + 1, y, 0.3, "F");
      }
    }
  };

  // ===========================================
  // HEADER PREMIUM CON GRADIENTE
  // ===========================================

  //createGradientHeader(0, 25);

  // Logo placeholder y marca de agua
  setFillColor(theme.colors.background);
  setColor(theme.colors.primary);

  try {
    const logoUrl = "/logo-fp.png";
    const logo = await loadImage(logoUrl);
    doc.addImage(logo, "PNG", 14, 10, 45, 15);
  } catch (error) {
    // Continuar sin logo si hay error
  }

  // Número de acta en header
  const numeroActa =
    data.numeroActa || `ACT-${Date.now().toString().slice(-6)}`;
  setColor([255, 255, 255]);
  doc.setFontSize(10);
  doc.text(`Fecha: ${data.fecha}`, CONFIG.pageWidth - 20, 18, {
    align: "right",
  });

  let currentY = 40;

  // ===========================================
  // TÍTULO PRINCIPAL CON DISEÑO PREMIUM
  // ===========================================

  setColor(theme.colors.primary);
  centerText(
    "ACTA OFICIAL",
    currentY,
    CONFIG.fonts.title.size,
    CONFIG.fonts.title.weight
  );
  currentY += 10;

  centerText(
    "DE ENTREGA DE PREMIO",
    currentY,
    CONFIG.fonts.subtitle.size,
    CONFIG.fonts.subtitle.weight
  );
  currentY += 5;

  // Patrón decorativo bajo el título
  createDecorativePattern((CONFIG.pageWidth - 120) / 2, currentY, 120);
  currentY += 15;

  // Información institucional en recuadro elegante
  const orgBoxY = currentY;
  const orgBoxHeight = 25;

  setFillColor(theme.colors.lightGray);
  doc.roundedRect(
    CONFIG.margin,
    orgBoxY,
    CONFIG.contentWidth,
    orgBoxHeight,
    3,
    3,
    "F"
  );

  setDrawColor(theme.colors.accent);
  doc.setLineWidth(0.8);
  doc.roundedRect(
    CONFIG.margin,
    orgBoxY,
    CONFIG.contentWidth,
    orgBoxHeight,
    3,
    3
  );

  currentY += 8;
  setColor(theme.colors.primary);
  const organizacion =
    data.organizacion || "FUNDACIÓN PARA EL DESARROLLO COMUNITARIO";
  centerText(organizacion, currentY, 13, "bold");
  currentY += 7;

  setColor(theme.colors.secondary);
  const programa = data.programa || "Programa de Reconocimiento y Premiación";
  centerText(programa, currentY, 10);
  currentY += 15;

  // ===========================================
  // CUERPO DEL DOCUMENTO
  // ===========================================

  setColor(theme.colors.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(CONFIG.fonts.body.size);
  doc.setLineHeightFactor(1.6);

  const ciudad = data.ciudad || "la ciudad correspondiente";
  const preambulo = `En ${ciudad}, el día ${data.fecha}, mediante la presente ACTA OFICIAL se hace constar de manera solemne y para todos los efectos legales pertinentes que:`;

  doc.text(preambulo, CONFIG.margin, currentY, {
    maxWidth: CONFIG.contentWidth,
    align: "justify",
  });
  currentY += 25;

  // ===========================================
  // SECCIÓN DEL BENEFICIARIO - DISEÑO PREMIUM
  // ===========================================

  const beneficiaryBoxY = currentY;
  const beneficiaryBoxHeight = 55;

  // Fondo con gradiente sutil
  setFillColor([245, 247, 250]);
  doc.roundedRect(
    CONFIG.margin,
    beneficiaryBoxY,
    CONFIG.contentWidth,
    beneficiaryBoxHeight,
    5,
    5,
    "F"
  );

  // Borde elegante
  setDrawColor(theme.colors.accent);
  doc.setLineWidth(1.2);
  doc.roundedRect(
    CONFIG.margin,
    beneficiaryBoxY,
    CONFIG.contentWidth,
    beneficiaryBoxHeight,
    5,
    5
  );

  // Título de la sección
  setFillColor(theme.colors.primary);
  doc.roundedRect(CONFIG.margin + 10, beneficiaryBoxY - 5, 60, 10, 2, 2, "F");
  setColor([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BENEFICIARIO", CONFIG.margin + 40, beneficiaryBoxY + 1, {
    align: "center",
  });

  currentY += 12;

  // Grid de información del beneficiario
  const leftCol = CONFIG.margin + 15;
  const rightCol = CONFIG.margin + CONFIG.contentWidth / 2 + 10;

  // Columna izquierda
  setColor(theme.colors.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("NOMBRE COMPLETO:", leftCol, currentY);
  setColor(theme.colors.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.nombre, leftCol, currentY + 6);

  doc.setFont("helvetica", "bold");
  setColor(theme.colors.primary);
  doc.setFontSize(10);
  doc.text("DOCUMENTO:", leftCol, currentY + 16);
  setColor(theme.colors.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`C.C. ${data.cedula}`, leftCol, currentY + 22);

  // Columna derecha
  setColor(theme.colors.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ARTÍCULO ENTREGADO:", rightCol, currentY);
  setColor(theme.colors.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.premio, rightCol, currentY + 6, { maxWidth: 75 });

  if (data.valorPremio) {
    setColor(theme.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("VALOR ESTIMADO:", rightCol, currentY + 16);
    setColor(theme.colors.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(data.valorPremio, rightCol, currentY + 22);
  }

  currentY += 45;

  // ===========================================
  // DECLARACIONES LEGALES
  // ===========================================

  const declaraciones = [
    "El/la beneficiario(a) anteriormente identificado(a) ha sido oficialmente seleccionado(a) para recibir el premio especificado, en el marco del programa institucional mencionado.",

    "Se certifica que el artículo ha sido entregado en perfectas condiciones, cumpliendo con todos los estándares de calidad establecidos por la organización.",

    "El/la beneficiario(a) manifiesta expresamente su total conformidad con el premio recibido, declarando no tener objeción, reclamo o salvedad alguna respecto al mismo.",

    "La presente acta se extiende en dos (2) ejemplares de igual tenor y valor legal, conservando cada parte interesada un ejemplar debidamente firmado para constancia y efectos pertinentes.",
  ];

  setColor(theme.colors.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(CONFIG.fonts.body.size);

  declaraciones.forEach((declaracion, index) => {
    const bullet = `${index + 1}.`;
    doc.setFont("helvetica", "bold");
    doc.text(bullet, CONFIG.margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(declaracion, CONFIG.margin + 8, currentY, {
      maxWidth: CONFIG.contentWidth - 8,
      align: "justify",
    });
    currentY += 18;
  });

  // ===========================================
  // SECCIÓN DE FIRMAS PREMIUM
  // ===========================================

  currentY = 220;

  // Línea separadora elegante
  setDrawColor(theme.colors.accent);
  doc.setLineWidth(0.8);
  createDecorativePattern(CONFIG.margin, currentY - 5, CONFIG.contentWidth);

  const signatureBoxWidth = 75;
  const signatureBoxHeight = 35;
  const leftSigX = CONFIG.margin + 10;
  const rightSigX = CONFIG.pageWidth - CONFIG.margin - signatureBoxWidth - 10;

  // Cajas de firma con diseño elegante
  [
    {
      x: leftSigX,
      title: "BENEFICIARIO",
      subtitle: data.nombre,
      id: `C.C. ${data.cedula}`,
    },
    {
      x: rightSigX,
      title: "REPRESENTANTE INSTITUCIONAL",
      subtitle: data.representante || "Representante Legal",
      id: data.cargo || "Director Ejecutivo",
    },
  ].forEach((signature) => {
    // Caja de firma
    setFillColor([252, 252, 253]);
    doc.roundedRect(
      signature.x,
      currentY,
      signatureBoxWidth,
      signatureBoxHeight,
      3,
      3,
      "F"
    );

    setDrawColor(theme.colors.secondary);
    doc.setLineWidth(0.6);
    doc.roundedRect(
      signature.x,
      currentY,
      signatureBoxWidth,
      signatureBoxHeight,
      3,
      3
    );

    // Línea de firma
    setDrawColor(theme.colors.primary);
    doc.setLineWidth(1);
    doc.line(
      signature.x + 10,
      currentY + 20,
      signature.x + signatureBoxWidth - 10,
      currentY + 20
    );

    // Textos de firma
    setColor(theme.colors.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      signature.title,
      signature.x + signatureBoxWidth / 2,
      currentY + 25,
      { align: "center" }
    );

    setColor(theme.colors.text);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      signature.subtitle,
      signature.x + signatureBoxWidth / 2,
      currentY + 29,
      { align: "center" }
    );
    doc.text(signature.id, signature.x + signatureBoxWidth / 2, currentY + 32, {
      align: "center",
    });
  });

  // ===========================================
  // FOOTER PROFESIONAL
  // ===========================================

  const footerY = CONFIG.pageHeight - 20;

  // Línea decorativa del footer
  createDecorativePattern(CONFIG.margin, footerY - 5, CONFIG.contentWidth);

  setColor(theme.colors.secondary);
  doc.setFontSize(7);
  doc.text(
    `Documento generado digitalmente el ${new Date().toLocaleDateString(
      "es-ES",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )} • Acta No. ${numeroActa}`,
    CONFIG.pageWidth / 2,
    footerY,
    { align: "center" }
  );

  // Marca de agua sutil
  doc.setGState(doc.GState({ opacity: 0.1 }));
  setColor(theme.colors.primary);
  doc.setFontSize(60);
  doc.text("EDUARD", CONFIG.pageWidth / 2, CONFIG.pageHeight / 2, {
    align: "center",
    angle: -45,
  });

  // Guardar archivo
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `Acta_Premio_${data.nombre.replace(
    /\s+/g,
    "_"
  )}_${numeroActa}_${timestamp}.pdf`;
  doc.save(fileName);
};

// ===========================================
// FUNCIONES AUXILIARES MEJORADAS
// ===========================================

export const generarActaPremium = (
  nombre: string,
  cedula: string,
  premio: string,
  opciones: Partial<PDFData> = {},
  tema: keyof typeof THEMES = "corporate"
) => {
  const fecha = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  generarActaEntregaPDF(
    {
      nombre,
      cedula,
      premio,
      fecha,
      ...opciones,
    },
    tema
  );
};

export const previewTemas = () => {
  return Object.entries(THEMES).map(([key, theme]) => ({
    id: key,
    nombre: theme.name,
    colores: theme.colors,
  }));
};

// Validador de datos
export const validarDatos = (data: Partial<PDFData>): string[] => {
  const errores: string[] = [];

  if (!data.nombre?.trim()) errores.push("El nombre es requerido");
  if (!data.cedula?.trim()) errores.push("La cédula es requerida");
  if (!data.premio?.trim())
    errores.push("La descripción del premio es requerida");
  if (!data.fecha?.trim()) errores.push("La fecha es requerida");

  return errores;
};
