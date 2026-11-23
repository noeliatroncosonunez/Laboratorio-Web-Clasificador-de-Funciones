document.addEventListener("DOMContentLoaded", () => {
  // Muestra la fecha del dia en el encabezado
  const today = new Date();
  document.getElementById("current-date").textContent = today.toLocaleDateString("es-ES");

  const btnGenerate = document.getElementById("btn-generate");
  const valB = document.getElementById("val-b");
  const valC = document.getElementById("val-c");
  const eqDisplay = document.getElementById("equation-display");
  const ggbContainer = document.getElementById("geogebra-container");
  const ggbStatus = document.getElementById("geogebra-status");
  const ggbFileInput = document.getElementById("ggb-file");
  const fileInfo = document.getElementById("file-info");

  // Relaciona cada tipo de funcion con su tarjeta y su indicador
  const cases = {
    affine: {
      box: document.getElementById("box-afin"),
      badge: document.getElementById("badge-afin")
    },
    linear: {
      box: document.getElementById("box-lineal"),
      badge: document.getElementById("badge-lineal")
    },
    constant: {
      box: document.getElementById("box-constant"),
      badge: document.getElementById("badge-constant")
    },
    zero: {
      box: document.getElementById("box-zero"),
      badge: document.getElementById("badge-zero")
    }
  };

  let currentB = 0;
  let currentC = 0;
  let geogebraApplet;

  // Devuelve un numero entero aleatorio dentro de los limites indicados
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Genera un coeficiente entre -10 y 10, excluyendo el cero
  function getRandomNonZeroInt() {
    const value = getRandomInt(-10, 9);
    return value < 0 ? value : value + 1;
  }

  // Escribe la funcion sin mostrar coeficientes innecesarios
  function formatEquation(b, c) {
    if (b === 0) return `f(x) = ${c}`;

    let equation = b === 1 ? "x" : b === -1 ? "-x" : `${b}x`;
    if (c > 0) equation += ` + ${c}`;
    if (c < 0) equation += ` - ${Math.abs(c)}`;
    return `f(x) = ${equation}`;
  }

  // Describe si la recta sube, baja o permanece horizontal
  function getSlopeText(b) {
    if (b > 0) return `Creciente (b = ${b})`;
    if (b < 0) return `Decreciente (b = ${b})`;
    return "Constante (recta horizontal)";
  }

  // Determina cual de los cuatro casos corresponde a b y c
  function getCase(b, c) {
    if (b === 0) return c === 0 ? "zero" : "constant";
    return c === 0 ? "linear" : "affine";
  }

  // Resalta el caso actual y actualiza sus datos visibles
  function updateClassification(b, c) {
    const activeCase = getCase(b, c);
    Object.values(cases).forEach(({ box, badge }) => {
      const active = box.id === cases[activeCase].box.id;
      box.classList.toggle("activa", active);
      badge.textContent = active ? "Caso actual" : "No corresponde";
    });

    document.getElementById("formula-afin").textContent = formatEquation(b, c);
    document.getElementById("corte-y").textContent = c;
    document.getElementById("slope-afin").textContent = getSlopeText(b);
    document.getElementById("units-c").textContent =
      `${Math.abs(c)} ${c > 0 ? "hacia arriba" : "hacia abajo"}`;

    document.getElementById("formula-lineal").textContent = formatEquation(b, 0);
    document.getElementById("slope-lineal").textContent = getSlopeText(b);
    document.getElementById("formula-constant").textContent = `f(x) = ${c}`;
  }

  // Envia a GeoGebra la expresion de la funcion para dibujarla
  function updateGeoGebra(b, c) {
    if (!geogebraApplet) return;

    const command = `f(x) = (${b}) * x + (${c})`;
    if (!geogebraApplet.evalCommand(command)) {
      ggbStatus.textContent = "GeoGebra no pudo representar la función. Intenta generar otra.";
      ggbStatus.classList.add("error");
      return;
    }

    ggbStatus.textContent = `GeoGebra Classic: ${formatEquation(b, c)}`;
    ggbStatus.classList.remove("error");
  }

  // Configura e inserta el applet de GeoGebra en la pagina
  function initializeGeoGebra() {
    const applet = new window.GGBApplet({
      appName: "classic",
      width: ggbContainer.clientWidth,
      height: 460,
      showToolBar: false,
      showMenuBar: false,
      showAlgebraInput: false,
      showResetIcon: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      showFullscreenButton: true,
      useBrowserForJS: true,
      appletOnLoad(api) {
        geogebraApplet = api;
        updateGeoGebra(currentB, currentC);
      }
    }, true);

    applet.inject(ggbContainer);
    const resizeObserver = new ResizeObserver(() => {
      if (geogebraApplet) {
        geogebraApplet.setSize(Math.max(320, ggbContainer.clientWidth), 460);
      }
    });
    resizeObserver.observe(ggbContainer);
  }

  // Carga la biblioteca oficial necesaria para mostrar GeoGebra
  function loadGeoGebra() {
    const apiScript = document.createElement("script");
    apiScript.src = "https://www.geogebra.org/apps/deployggb.js";
    apiScript.async = true;
    apiScript.onload = () => {
      if (typeof window.GGBApplet !== "function") {
        ggbStatus.textContent = "GeoGebra cargó de forma incompleta. Revisa tu conexión e inténtalo de nuevo.";
        ggbStatus.classList.add("error");
        return;
      }
      initializeGeoGebra();
    };
    apiScript.onerror = () => {
      ggbStatus.textContent = "No se pudo cargar GeoGebra. Revisa tu conexión o ábrelo desde el enlace inferior.";
      ggbStatus.classList.add("error");
    };
    document.head.appendChild(apiScript);
  }

  // Elige uno de los cuatro casos y actualiza la pagina y el grafico
  function processFunction() {
    switch (getRandomInt(0, 3)) {
      case 0:
        currentB = getRandomNonZeroInt();
        currentC = getRandomNonZeroInt();
        break;
      case 1:
        currentB = getRandomNonZeroInt();
        currentC = 0;
        break;
      case 2:
        currentB = 0;
        currentC = getRandomNonZeroInt();
        break;
      default:
        currentB = 0;
        currentC = 0;
    }

    valB.textContent = currentB;
    valC.textContent = currentC;
    eqDisplay.textContent = formatEquation(currentB, currentC);
    updateClassification(currentB, currentC);
    updateGeoGebra(currentB, currentC);
  }

  // Informa el nombre y tamano del archivo .ggb seleccionado
  ggbFileInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (!file) return;

    fileInfo.textContent = `Archivo cargado: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    fileInfo.style.color = "#16866d";
  });

  btnGenerate.addEventListener("click", processFunction);

  // Presenta una funcion al abrir la pagina y luego carga GeoGebra
  processFunction();
  loadGeoGebra();
});
