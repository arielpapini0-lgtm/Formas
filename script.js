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
guardarBtn.onclick = () => {
  const nombre = document.getElementById("name").value.trim();
  const escuela = document.getElementById("school").value;
  const pais = document.getElementById("country").value;
  const estilo = document.querySelector("header #kataStyle").value;

  if (!nombre) return alert("Ingresá el nombre del competidor.");

  const resultado = scores.length === 5 ? parseFloat(calculateFinalScore(scores)) : null;
  const existente = competidores.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());

  if (existente) {
    existente.escuela = escuela;
    existente.pais = pais;
    existente.estilo = estilo;
    if (scores.length === 5) {
      existente.resultado = resultado;
      existente.puntajes = [...scores];
      alert(`Puntaje actualizado para ${nombre}`);
    } else {
      alert(`Datos actualizados para ${nombre}`);
    }
  } else {
    competidores.push({
      nombre,
      escuela,
      pais,
      estilo,
      resultado,
      puntajes: scores.length === 5 ? [...scores] : []
    });
    alert(`Competidor ${nombre} registrado${scores.length === 5 ? ` con ${resultado} puntos` : ""}`);
  }

  actualizarSelectorCompetidor();
  mostrarListaCompleta();
  mostrarPodio();

  // Reset campos
  scores = [];
  scoreList.innerHTML = "";
  averageDisplay.textContent = "0.00";
  document.getElementById("name").value = "";
  document.getElementById("school").value = "";
  document.getElementById("country").value = "";
};

function mostrarListaCompleta() {
  if (competidores.length === 0) {
    listaDiv.innerHTML = "<h2>📋 Competidores</h2><p>No hay competidores registrados aún.</p>";
    return;
  }

  let html = `
    <h2>📋 Competidores</h2>
    <table class="tabla-competidores">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Escuela</th>
          <th>País</th>
          <th>Estilo</th>
          <th>Puntaje Final</th>
          <th>Puntajes</th>
        </tr>
      </thead>
      <tbody>
  `;

  competidores.forEach((c, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${c.nombre}</td>
        <td>${c.escuela}</td>
        <td>${c.pais}</td>
        <td>${c.estilo}</td>
        <td>${c.resultado ?? "—"}</td>
        <td>${c.puntajes?.length === 5 ? c.puntajes.map((p, i) => `J${i + 1}: ${p}`).join(" | ") : "Sin puntaje"}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  listaDiv.innerHTML = html;
}

function mostrarPodio() {
  const top3 = [...competidores].filter(c => c.resultado !== null).sort((a, b) => b.resultado - a.resultado).slice(0, 3);

  podioDiv.innerHTML = "<h3>🏆 Podio</h3>";

  if (top3.length === 0) {
    podioDiv.innerHTML += "<p>No hay competidores con puntaje.</p>";
    return;
  }

  top3.forEach((c, i) => {
    const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    podioDiv.innerHTML += `<p>${medalla} ${c.nombre} - ${c.resultado} pts</p>`;
  });
}

mostrarGanadoresBtn.onclick = () => {
  mostrarListaCompleta();
  mostrarPodio();
};
function actualizarSelectorCompetidor() {
  const selector = document.getElementById("selectorCompetidor");
  selector.innerHTML = '<option value="">— Elegí un competidor —</option>';
  competidores.forEach((c, i) => {
    selector.innerHTML += `<option value="${i}">${c.nombre}</option>`;
  });
}

function cargarCompetidorSeleccionado() {
  const index = document.getElementById("selectorCompetidor").value;
  if (index === "") return;

  const c = competidores[index];
  document.getElementById("name").value = c.nombre;
  document.getElementById("school").value = c.escuela;
  document.getElementById("country").value = c.pais;

  scores = [...c.puntajes];
  updateScoreList();
  averageDisplay.textContent = scores.length === 5 ? calculateFinalScore(scores) : "0.00";
}

function mostrarPresentacion() {
  const pantalla = document.createElement("div");
  pantalla.className = "fullscreen";
  const top3 = [...competidores].filter(c => c.resultado !== null).sort((a, b) => b.resultado - a.resultado).slice(0, 3);
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

function actualizarCategoria() {
  const nivel = document.getElementById("nivelCinturon").value;
  const grupo = document.getElementById("grupoEdad").value;
  torneo.categoria = `${grupo} - ${nivel}`;
}

function exportarResultados() {
  const encabezado = "Nombre,Escuela,País,Estilo,Puntaje Final,Juez 1,Juez 2,Juez 3,Juez 4,Juez 5\n";

  const filas = competidores.map(c => {
    const puntajes = c.puntajes ?? ["", "", "", "", ""];
    return [
      `"${c.nombre}"`,
      `"${c.escuela}"`,
      `"${c.pais}"`,
      `"${c.estilo}"`,
      c.resultado ?? "",
      ...puntajes.map(p => p ?? "")
    ].join(",");
  }).join("\n");

  const csv = encabezado + filas;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultados_kata.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function generarHojaImprimible() {
  const ventana = window.open("", "Hoja de Resultados", "width=800,height=600");
  const top3 = [...competidores].filter(c => c.resultado !== null).sort((a, b) => b.resultado - a.resultado).slice(0, 3);

  let html = `
    <html>
    <head>
      <title>Resultados del Torneo</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          padding: 60px;
          background: #fff;
          color: #333;
        }
        h1, h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        th, td {
          border: 1px solid #999;
          padding: 10px;
          text-align: center;
        }
        th {
          background-color: #eee;
        }
        .podio {
          text-align: right;
          font-size: 16px;
        }
        .firma {
          margin-top: 60px;
          font-size: 14px;
        }
        .firma label {
          display: block;
          margin-bottom: 40px;
        }
      </style>
    </head>
    <body>
      <h1>${torneo.nombre ?? "Torneo de Artes Marciales"}</h1>
      <h2>Categoría: ${torneo.categoria ?? "Sin categoría definida"}</h2>
      <table>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Escuela</th>
          <th>País</th>
          <th>Estilo</th>
          <th>J1</th><th>J2</th><th>J3</th><th>J4</th><th>J5</th>
          <th>Puntaje Final</th>
        </tr>
  `;

  competidores.forEach((c, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.nombre}</td>
        <td>${c.escuela}</td>
        <td>${c.pais}</td>
        <td>${c.estilo}</td>
        ${c.puntajes.map(p => `<td>${p}</td>`).join("")}
        <td>${c.resultado ?? "—"}</td>
      </tr>
    `;
  });

  html += `</table>
    <div class="firma">
      <label>Firma del presentador del torneo: ____________________________</label>
      <label>Fecha: ${new Date().toLocaleDateString()}</label>
    </div>
    <div class="podio"><h3>🏆 Podio</h3>`;
  top3.forEach((c, i) => {
    const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    html += `<div>${medalla} ${c.nombre} - ${c.resultado} pts</div>`;
  });
  html += `</div></body></html>`;

  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  ventana.print();
}
