const scoreButtons = document.getElementById("scoreButtons");
const scoreList = document.getElementById("scoreList");
const averageDisplay = document.getElementById("average");
const confirmButton = document.getElementById("confirmScore");
const guardarBtn = document.getElementById("guardarCompetidor");
const mostrarGanadoresBtn = document.getElementById("mostrarGanadores");
const podioDiv = document.getElementById("podio");
const listaDiv = document.getElementById("competidorLista");

let scores = [];
let competidores = [];

// Generar botones de puntuación de 4.0 a 9.0 en pasos de 0.5
for (let i = 4.0; i <= 9.0; i += 0.5) {
  const btn = document.createElement("button");
  btn.textContent = i.toFixed(1);
  btn.onclick = () => {
    if (scores.length < 5) {
      scores.push(i);
      updateScoreList();
    } else {
      alert("Ya hay 5 puntajes. Confirmá o guardá antes de continuar.");
    }
  };
  scoreButtons.appendChild(btn);
}

// Actualiza la lista de puntajes con animaciones
function updateScoreList() {
  scoreList.innerHTML = "";

  if (scores.length === 5) {
    const ordenados = [...scores].map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
    const lowIdx = ordenados[0].idx;
    const highIdx = ordenados[4].idx;

    scores.forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `Juez ${index + 1}: ${score.toFixed(1)}`;
      if (index === lowIdx) li.classList.add("discard-low");
      else if (index === highIdx) li.classList.add("discard-high");
      scoreList.appendChild(li);
    });
  } else {
    scores.forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `Juez ${index + 1}: ${score.toFixed(1)}`;
      scoreList.appendChild(li);
    });
  }
}

// Calcula la suma de los 3 puntajes intermedios
function calculateFinalScore(arr) {
  if (arr.length !== 5) return "0.00";
  const ordenados = [...arr].sort((a, b) => a - b);
  ordenados.shift(); // elimina el más bajo
  ordenados.pop();   // elimina el más alto
  const suma = ordenados.reduce((a, b) => a + b, 0);
  return suma.toFixed(2);
}

// Muestra el resultado final
confirmButton.onclick = () => {
  if (scores.length === 5) {
    const resultado = calculateFinalScore(scores);
    averageDisplay.textContent = resultado;
  } else {
    alert("Debe haber exactamente 5 puntajes.");
  }
};

// Guarda el competidor con su resultado
guardarBtn.onclick = () => {
  if (scores.length === 5) {
    const nombre = document.getElementById("name").value;
    const escuela = document.getElementById("school").value;
    const pais = document.getElementById("country").value;
    const estilo = document.getElementById("kataStyle").value;
    const resultado = parseFloat(calculateFinalScore(scores));

    competidores.push({ nombre, escuela, pais, estilo, resultado });
    alert(`Competidor ${nombre} guardado con ${resultado} puntos`);

    // Reset
    scores = [];
    scoreList.innerHTML = "";
    averageDisplay.textContent = "0.00";
    document.getElementById("name").value = "";
    document.getElementById("school").value = "";
    document.getElementById("country").value = "";
  } else {
    alert("Debe haber 5 puntajes antes de guardar.");
  }
};

// Muestra la lista completa de competidores
function mostrarListaCompleta() {
  listaDiv.innerHTML = "<h2>📋 Competidores</h2><ul>";
listaDiv.innerHTML = "<h2>📋 Competidores</h2><ul>";
competidores.forEach((c, index) => {
  listaDiv.innerHTML += `
    <li>
      <strong>${index + 1}. ${c.nombre}</strong><br>
      Escuela: ${c.escuela} | País: ${c.pais} | Estilo: ${c.estilo}<br>
      Puntaje final: <span style="color:#0f0">${c.resultado}</span><br>
      Puntajes: ${c.puntajes.map((p, i) => `J${i + 1}: ${p}`).join(" | ")}
    </li>
  `;
});
listaDiv.innerHTML += "</ul>";
  if (competidores.length === 0) {
    listaDiv.innerHTML += "<p>No hay competidores registrados aún.</p>";
    return;
  }

  competidores.forEach((c, index) => {
    listaDiv.innerHTML += `
      <li>
        <strong>${index + 1}. ${c.nombre}</strong><br>
        Escuela: ${c.escuela} | País: ${c.pais} | Estilo: ${c.estilo}<br>
        Puntaje final: <span style="color:#0f0">${c.resultado}</span>
      </li>
    `;
  });

  listaDiv.innerHTML += "</ul>";
}

// Muestra el podio con los 3 mejores
function mostrarPodio() {
  const top3 = [...competidores].sort((a, b) => b.resultado - a.resultado).slice(0, 3);

  podioDiv.innerHTML = "<h3>🏆 Podio</h3>";

  if (top3.length === 0) {
    podioDiv.innerHTML += "<p>No hay competidores suficientes.</p>";
    return;
  }

  top3.forEach((c, i) => {
    const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    podioDiv.innerHTML += `<p>${medalla} ${c.nombre} - ${c.resultado} pts</p>`;
  });
}

// Botón que muestra lista completa y podio
mostrarGanadoresBtn.onclick = () => {
  mostrarListaCompleta();
  mostrarPodio();
};
guardarBtn.onclick = () => {
  const nombre = document.getElementById("name").value.trim();
  if (!nombre || scores.length !== 5) return alert("Completa nombre y 5 puntajes.");

  const resultado = parseFloat(calculateFinalScore(scores));
  const existente = competidores.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());

  if (existente) {
    existente.resultado = resultado;
    existente.puntajes = [...scores];
    alert(`Puntaje actualizado para ${nombre}`);
  } else {
    const escuela = document.getElementById("school").value;
    const pais = document.getElementById("country").value;
    const estilo = document.getElementById("kataStyle").value;
    competidores.push({ nombre, escuela, pais, estilo, resultado, puntajes: [...scores] });
    alert(`Competidor ${nombre} guardado con ${resultado} puntos`);
  }

  // Reset
  scores = [];
  scoreList.innerHTML = "";
  averageDisplay.textContent = "0.00";
  document.getElementById("name").value = "";
  document.getElementById("school").value = "";
  document.getElementById("country").value = "";
};
function mostrarPresentacion() {
  const pantalla = document.createElement("div");
  pantalla.className = "fullscreen";
  const top3 = [...competidores].sort((a, b) => b.resultado - a.resultado).slice(0, 3);
  pantalla.innerHTML = "<h1>🏆 Podio Final</h1>";
  top3.forEach((c, i) => {
    const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    pantalla.innerHTML += `<p>${medalla} ${c.nombre} - ${c.resultado} pts</p>`;
  });
  pantalla.onclick = () => pantalla.remove();
  document.body.appendChild(pantalla);
}
document.getElementById("kataStyle").onchange = (e) => {
  const estilo = e.target.value;
  document.body.className = estilo; // aplica clase al body
};
let torneo = {
  categoria: "Juvenil Masculino",
  ronda: 1,
  competidores: [],
  resultados: [],
};