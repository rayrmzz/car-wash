if (!verificarSesion()) {
}

function verificarSesion() {
  const usuario = localStorage.getItem("usuarioLogueado");
  const loginTime = localStorage.getItem("loginTime");
  const currentTime = new Date().getTime();

  if (!usuario || !loginTime || currentTime - loginTime > 28800000) {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("loginTime");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

let movimientos = [];
let tipoActual = null;

let botonAgregarGasto = document.getElementById("agregarGasto");
let botonAgregarPago = document.getElementById("agregarPago");
let listaMovimientos = document.getElementById("listaMovimientos");
let formularioMovimiento = document.getElementById("formularioMovimiento");
let formMovimiento = document.getElementById("formMovimiento");
let botonCancelar = document.getElementById("cancelarMovimiento");

function mostrarFormulario(tipo) {
  console.log("Intentando mostrar formulario para tipo:", tipo);
  console.log("Elemento formulario encontrado:", formularioMovimiento);
  tipoActual = tipo;

  const titulo = document.querySelector("#tituloFormulario");
  const selectTipo = document.getElementById("tipoMovimiento");

  if (tipo === "gasto") {
    titulo.textContent = "Nuevo Gasto";
    selectTipo.value = "gasto";
  } else if (tipo === "pago") {
    titulo.textContent = "Nuevo Pago";
    selectTipo.value = "pago";
  }

  formularioMovimiento.style.display = "block";
  document.getElementById("descripcionMovimiento").focus();
}

function ocultarFormulario() {
  formularioMovimiento.style.display = "none";
  formMovimiento.reset();
  tipoActual = null;
}

function agregarMovimiento(event) {
  event.preventDefault();

  let descripcion = document.getElementById("descripcionMovimiento").value;
  let monto = document.getElementById("montoMovimiento").value;

  if (descripcion && monto && tipoActual) {
    let nuevoMovimiento = {
      id: Date.now(),
      tipo: tipoActual,
      descripcion: descripcion,
      monto: parseFloat(monto),
      fecha: new Date().toLocaleDateString(),
    };

    movimientos.push(nuevoMovimiento);
    mostrarMovimientos();
    guardarMovimientos();
    ocultarFormulario();
  }
}

function mostrarMovimientos() {
  listaMovimientos.innerHTML = "";

  movimientos.forEach((mov) => {
    let movDiv = document.createElement("div");
    movDiv.className = "item";
    movDiv.innerHTML = `
    <div class="itemInfo">
        <div><strong>Tipo:</strong> ${
          mov.tipo === "gasto" ? "Gasto" : "Pago"
        }</div>
        <div><strong>Descripción:</strong> ${mov.descripcion}</div>
        <div><strong>Monto:</strong> $${mov.monto.toFixed(2)}</div>
        <div><strong>Fecha:</strong> ${mov.fecha}</div>
    </div>
    <div class="itemActions">
      <button onclick="eliminarMovimiento(${
        mov.id
      })" class="deleteButton">Eliminar</button>
    </div>
`;
    listaMovimientos.appendChild(movDiv);
  });
}

function eliminarMovimiento(id) {
  movimientos = movimientos.filter((mov) => mov.id !== id);
  mostrarMovimientos();
  guardarMovimientos();
}

function guardarMovimientos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function cargarMovimientos() {
  let movimientosGuardados = localStorage.getItem("movimientos");
  if (movimientosGuardados) {
    movimientos = JSON.parse(movimientosGuardados);
    mostrarMovimientos();
  }
}

cargarMovimientos();

botonAgregarGasto.onclick = () => mostrarFormulario("gasto");
botonAgregarPago.onclick = () => mostrarFormulario("pago");
botonCancelar.onclick = ocultarFormulario;
formMovimiento.onsubmit = agregarMovimiento;

formularioMovimiento.onclick = function (event) {
  if (event.target === formularioMovimiento) {
    ocultarFormulario();
  }
};
