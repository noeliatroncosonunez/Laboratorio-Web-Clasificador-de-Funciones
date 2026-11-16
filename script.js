document.addEventListener("DOMContentLoaded", () => {
  // Configurar Fecha Actual
  const today = new Date();
  document.getElementById("current-date").textContent = today.toLocaleDateString("es-ES");

  // Elementos del DOM
  const btnGenerate = document.getElementById("btn-generate");
  const valB = document.getElementById("val-b");
  const valC = document.getElementById("val-c");
  const eqDisplay = document.getElementById("equation-display");

  const boxLineal = document.getElementById("box-lineal");
  const badgeLineal = document.getElementById("badge-lineal");
  const propsLineal = document.getElementById("props-lineal");
  const formulaLineal = document.getElementById("formula-lineal");
  const slopeLineal = document.getElementById("slope-lineal");

  const boxAfin = document.getElementById("box-afin");
  const badgeAfin = document.getElementById("badge-afin");
  const propsAfin = document.getElementById("props-afin");
  const formulaAfin = document.getElementById("formula-afin");
  const corteY = document.getElementById("corte-y");
  const slopeAfin = document.getElementById("slope-afin");
  const unitsC = document.getElementById("units-c");

  const canvas = document.getElementById("graphCanvas");
  const ctx = canvas.getContext("2d");
  const ggbFileInput = document.getElementById("ggb-file");
  const fileInfo = document.getElementById("file-info");

  // Generador aleatorio [-10, 10]
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Formateador de ecuación algebraica
  function formatEquation(b, c) {
    let eq = "f(x) = ";
    if (b === 0) {
      eq += c;
    } else {
      if (b === 1) eq += "x";
      else if (b === -1) eq += "-x";
      else eq += `${b}x`;

      if (c > 0) eq += ` + ${c}`;
      else if (c < 0) eq += ` - ${Math.abs(c)}`;
    }
    return eq;
  }

  // Texto descriptivo de la pendiente (b)
  function getSlopeText(b) {
    if (b > 0) return `Creciente (b = ${b} > 0, sube de izquierda a derecha)`;
    if (b < 0) return `Decreciente (b = ${b} < 0, baja de izquierda a derecha)`;
    return `Constante (b = 0, recta horizontal)`;
  }

  // Función de Dibujo en Canvas
  function drawGraph(b, c) {
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 10; // 10px = 1 unidad

    ctx.clearRect(0, 0, width, height);

    // Rejilla (Grid)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Ejes Cartesianos
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;

    // Eje X
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(width, originY); ctx.stroke();
    // Eje Y
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, height); ctx.stroke();

    // Etiqueta de Origen (0,0)
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.fillText("(0,0)", originX + 3, originY + 12);

    // Graficar la recta f(x) = bx + c
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const xStart = -20;
    const yStart = b * xStart + c;
    const canvasXStart = originX + xStart * scale;
    const canvasYStart = originY - yStart * scale;

    const xEnd = 20;
    const yEnd = b * xEnd + c;
    const canvasXEnd = originX + xEnd * scale;
    const canvasYEnd = originY - yEnd * scale;

    ctx.moveTo(canvasXStart, canvasYStart);
    ctx.lineTo(canvasXEnd, canvasYEnd);
    ctx.stroke();

    // Dibujar Punto de Corte en Eje Y (0, c)
    const cutX = originX;
    const cutY = originY - c * scale;
    ctx.fillStyle = c === 0 ? "#16a34a" : "#dc2626";
    ctx.beginPath();
    ctx.arc(cutX, cutY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lógica Principal de Evaluación y Clasificación
  function processFunction() {
    const b = getRandomInt(-10, 10);
    const c = getRandomInt(-10, 10);

    // Actualizar Coeficientes
    valB.textContent = b;
    valC.textContent = c;
    eqDisplay.textContent = formatEquation(b, c);

    // Clasificación Condicional (c === 0 vs c !== 0)
    if (c === 0) {
      // --- FUNCIÓN LINEAL ---
      boxLineal.classList.add("active");
      badgeLineal.textContent = "¡CUMPLE!";
      propsLineal.classList.remove("hidden");
      formulaLineal.textContent = formatEquation(b, 0);
      slopeLineal.textContent = getSlopeText(b);

      boxAfin.classList.remove("active");
      badgeAfin.textContent = "No cumple";
      propsAfin.classList.add("hidden");
    } else {
      // --- FUNCIÓN AFÍN ---
      boxAfin.classList.add("active");
      badgeAfin.textContent = "¡CUMPLE!";
      propsAfin.classList.remove("hidden");
      formulaAfin.textContent = formatEquation(b, c);
      corteY.textContent = c;
      slopeAfin.textContent = b > 0 ? "creciente" : b < 0 ? "decreciente" : "constante";
      unitsC.textContent = `${Math.abs(c)} (${c > 0 ? "hacia arriba" : "hacia abajo"})`;

      boxLineal.classList.remove("active");
      badgeLineal.textContent = "No cumple";
      propsLineal.classList.add("hidden");
    }

    // Renderizar gráfico interactivo
    drawGraph(b, c);
  }

  // Manejo de Carga de Archivo GeoGebra (.ggb)
  ggbFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      fileInfo.textContent = `📄 Archivo cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      fileInfo.style.color = "#16a34a";
    }
  });

  // Evento Clic en Botón
  btnGenerate.addEventListener("click", processFunction);

  // Render inicial al cargar la página
  drawGraph(0, 0);
});