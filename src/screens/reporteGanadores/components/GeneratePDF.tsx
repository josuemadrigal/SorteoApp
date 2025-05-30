import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPremio, getContrastTextColor, loadImage } from "./utils";

interface Registro {
  id: number;
  nombre: string;
  cedula: string;
  municipio: string;
  premio: string;
  ronda: string;
  status: string;
  telefono: string;
}

interface Props {
  registros: Registro[];
  title?: string;
  municipio?: string;
  loading?: boolean;
  onError?: (error: Error) => void;
}

// Paleta de colores para premios (fuera del componente para mejor rendimiento)
const PREMIO_COLORS: Record<string, [number, number, number]> = {
  abanico: [186, 230, 253],
  televisor: [252, 211, 77],
  nevera: [244, 114, 182],
  microondas: [45, 212, 191],
  lavadora: [132, 204, 22],
  freidora: [156, 163, 175],
  licuadora: [192, 132, 252],
  "olla-de-presion": [251, 146, 60],
  "estufa-de-mesa-4-hornillas": [34, 211, 238],
  "estufa-de-horno": [248, 113, 113],
  "cilindro-de-gas-50lb": [232, 121, 249],
  "juego-de-ollas": [253, 224, 71],
  "bono-de-rd1500-pesos": [167, 139, 250],
  "bono-de-rd2000-pesos": [96, 165, 250],
};

export const GeneratePDF = ({
  registros,
  title = "Reporte de Ganadores",
  municipio = "",
  loading = false,
  onError,
}: Props) => {
  const generatePDF = async () => {
    if (loading) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        compress: true, // Comprimir PDF
      });

      // 1. Encabezado con logo
      await addHeader(doc);

      // 2. Generar contenido principal
      await addMainContent(doc);

      // 3. Generar resumen y pie de página
      addFooter(doc);

      // 4. Guardar PDF
      savePDF(doc);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      if (onError)
        onError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const addHeader = async (doc: jsPDF) => {
    try {
      const logoUrl = "/logo-fp.png";
      const logo = await loadImage(logoUrl);
      doc.addImage(logo, "PNG", 14, 10, 45, 15);
    } catch (error) {
      // Continuar sin logo si hay error
    }

    // Título principal
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 124, 7);
    doc.text(title, 105, 20, { align: "center" });

    // Subtítulo de municipio si existe
    if (municipio) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Municipio: ${municipio.toUpperCase()}`, 105, 26, {
        align: "center",
      });
    }

    // Fecha de generación
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generado el: ${new Date().toLocaleDateString("es-DO")}`,
      190,
      10,
      { align: "right" }
    );
  };

  const addMainContent = (doc: jsPDF) => {
    if (registros.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(150, 0, 0);
      doc.text("No hay registros para mostrar", 105, 40, { align: "center" });
      return;
    }

    // Ordenar registros por premio y luego por nombre
    const registrosOrdenados = [...registros].sort((a, b) => {
      if (a.premio !== b.premio) return a.premio.localeCompare(b.premio);
      return a.nombre.localeCompare(b.nombre);
    });

    // Agrupar por tipo de premio
    const premiosAgrupados = registrosOrdenados.reduce((acc, registro) => {
      const premioKey = registro.premio;
      if (!acc[premioKey]) acc[premioKey] = [];
      acc[premioKey].push(registro);
      return acc;
    }, {} as Record<string, Registro[]>);

    let startY = 40;
    let currentPremio = "";

    // Iterar sobre cada grupo de premios
    Object.entries(premiosAgrupados).forEach(([premioKey, registrosGrupo]) => {
      currentPremio = premioKey;

      const premioColor = PREMIO_COLORS[premioKey] || [209, 213, 219];
      const textColor = getContrastTextColor(premioColor);

      // Calcular espacio necesario (título + tabla)
      const titleHeight = 8;
      const rowHeight = 10; // altura aproximada por fila
      const headerHeight = 10; // altura del encabezado de tabla
      const margin = 10; // margen inferior
      const estimatedTableHeight =
        headerHeight + registrosGrupo.length * rowHeight;
      const totalSectionHeight = titleHeight + estimatedTableHeight + margin;

      // Verificar si hay suficiente espacio para el título + al menos 3 filas de la tabla
      const minTableRows = Math.min(3, registrosGrupo.length);
      const minSectionHeight =
        titleHeight + headerHeight + minTableRows * rowHeight + margin;
      // Verificar si necesitamos nueva página (considerando el título también)
      if (startY + minSectionHeight > 280) {
        // Si no cabe ni el título + 3 filas, mover todo a nueva página
        doc.addPage();
        startY = 20;
      } else if (startY + totalSectionHeight > 280) {
        // Si cabe el título pero no toda la tabla, verificar si el título quedaría solo
        const remainingSpace = 280 - startY - titleHeight;
        const minRowsToKeep = 3; // Mínimo de filas para considerar que no está solo

        if (remainingSpace < headerHeight + minRowsToKeep * rowHeight) {
          // Si el título quedaría con menos de 3 filas, mover todo a nueva página
          doc.addPage();
          startY = 20;
        }
      }
      // Agregar título de sección para el premio
      startY += titleHeight;
      doc.setFillColor(...premioColor);
      doc.setDrawColor(150, 150, 150); // Color del borde
      doc.rect(14, startY - 5, 180, 10, "FD"); // 'FD' = Fill and Draw (relleno y borde)

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textColor);
      doc.text(`Premio: ${formatPremio(premioKey)}`, 20, startY);
      startY += titleHeight;

      // Generar tabla para el grupo
      autoTable(doc, {
        head: [["#", "Nombre", "Cédula", "Teléfono", "Municipio"]],
        body: registrosGrupo.map((registro, index) => [
          index + 1,
          registro.nombre.toUpperCase(),
          formatCedula(registro.cedula),
          formatTelefono(registro.telefono),
          registro.municipio.toUpperCase(),
        ]),
        startY,
        headStyles: {
          fillColor: [21, 124, 7],
          textColor: 255,
          fontStyle: "bold",
        },
        bodyStyles: {
          fillColor: PREMIO_COLORS[premioKey] || [209, 213, 219],
          textColor: [0, 0, 0],
          fontSize: 9,
        },
        styles: {
          halign: "center",
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" }, // Número
          1: { halign: "left", cellWidth: "auto" }, // Nombre
          2: { cellWidth: 25 }, // Cédula
          3: { cellWidth: 25 }, // Teléfono
          4: { cellWidth: 30 }, // Municipio
        },
        margin: { top: 5 },
        pageBreak: "auto",
        didDrawPage: (data) => {
          // Agregar título en páginas subsiguientes
          if (data.pageNumber > 1 && data.cursor?.y && data.cursor.y < 40) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(`Premio: ${formatPremio(currentPremio)} (cont.)`, 14, 20);
          }
        },
        willDrawCell: (data) => {
          // Opcional: mantener estilo de color para celdas en páginas divididas
          if (data.section === "body") {
            data.cell.styles.fillColor = PREMIO_COLORS[currentPremio] || [
              209, 213, 219,
            ];
          }
        },
      });

      startY = (doc as any).lastAutoTable.finalY + 10;
    });
  };

  const addFooter = (doc: jsPDF) => {
    if (registros.length === 0) return;

    // Crear nueva página para el resumen
    doc.addPage();

    // Título del resumen
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128);
    doc.text("RESUMEN GENERAL DE PREMIOS", 105, 30, { align: "center" });

    // Calcular totales por premio
    const premiosCount = registros.reduce((acc, registro) => {
      acc[registro.premio] = (acc[registro.premio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Configurar posición inicial
    let yPos = 50;

    // Crear tabla para el resumen
    autoTable(doc, {
      head: [["Premio", "Cantidad"]],
      body: Object.entries(premiosCount).map(([premio, count]) => [
        formatPremio(premio),
        count.toString(),
      ]),
      startY: yPos,
      headStyles: {
        fillColor: [21, 124, 7],
        textColor: 255,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 11,
      },
      columnStyles: {
        0: { cellWidth: 120, halign: "left" }, // Premio
        1: { cellWidth: 30, halign: "center" }, // Cantidad
      },
      styles: {
        halign: "center",
        valign: "middle",
      },
      margin: { top: 20 },
    });

    // Posición después de la tabla
    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Total general
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL GENERAL DE GANADORES: ${registros.length}`, 105, yPos, {
      align: "center",
    });

    // Firma (centrada)
    yPos += 20;
    doc.setFontSize(10);
    doc.text("_________________________", 105, yPos, { align: "center" });
    doc.text("Firma Autorizada", 105, yPos + 5, { align: "center" });

    // Numeración de páginas
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Página ${i} de ${totalPages}`, 190, 287, { align: "right" });
    }
  };

  const savePDF = (doc: jsPDF) => {
    const fileName = `Ganadores_${municipio || "Todos"}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-.]/g, "");

    doc.save(fileName);
  };

  // Funciones de formato auxiliares
  const formatCedula = (cedula: string): string => {
    if (!cedula) return "N/A";
    return cedula.replace(/(\d{3})(\d{7})(\d{1})/, "$1-$2-$3");
  };

  const formatTelefono = (telefono: string): string => {
    if (!telefono) return "N/A";
    return telefono.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Exportar a PDF"
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}
      {loading ? "Generando PDF..." : "Exportar a PDF"}
    </button>
  );
};
