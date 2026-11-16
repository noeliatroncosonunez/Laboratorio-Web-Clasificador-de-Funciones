// Función para generar enteros aleatorios entre min y max (ambos inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById('btn-generar').addEventListener('click', () => {
  // 1. Generar b y c entre -10 y 10
  const b = getRandomInt(-10, 10);
  const c = getRandomInt(-10, 10);

  // 2. Mostrar valores en pantalla
  document.getElementById('val-b').textContent = b;
  document.getElementById('val-c').textContent = c;

  const cajaLineal = document.getElementById('caja-lineal');
  const cajaAfin = document.getElementById('caja-afin');

  // 3. Evaluar lógica de clasificación
  if (c === 0) {
    // FUNCIÓN LINEAL (c = 0)
    cajaLineal.classList.remove('hidden');
    cajaAfin.classList.add('hidden');

    document.getElementById('exp-lineal').textContent = `f(x) = ${b}x`;

    let pendText = "Pendiente (b): ";
    if (b > 0) {
      pendText += `b = ${b} > 0 → Función creciente (sube de izquierda a derecha).`;
    } else if (b < 0) {
      pendText += `b = ${b} < 0 → Función decreciente (baja de izquierda a derecha).`;
    } else {
      pendText += `b = 0 → Función constante sobre el eje X.`;
    }
    document.getElementById('prop-lineal-pend').innerHTML = `<strong>Pendiente:</strong> ${pendText}`;

  } else {
    // FUNCIÓN AFÍN (c ≠ 0)
    cajaAfin.classList.remove('hidden');
    cajaLineal.classList.add('hidden');

    const signoC = c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    document.getElementById('exp-afin').textContent = `f(x) = ${b}x ${signoC}`;

    document.getElementById('prop-afin-corte').innerHTML = `<strong>Corte Eje Y:</strong> Interseca al eje Y en las coordenadas (0, ${c}).`;
    document.getElementById('prop-afin-tras').innerHTML = `<strong>Traslación:</strong> Traslación vertical de f(x) = ${b}x en ${c} unidades.`;
  }
});