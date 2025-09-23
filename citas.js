let citas = [];

let botonAgregarCita = document.getElementById("nuevaCita");
let listaCitas = document.getElementById("listaCitas");
let formularioCita = document.getElementById("formularioCita");
let formCita = document.getElementById("formCita");
botonCancelar = document.getElementById("cancelarCita");

function mostrarFormulario() {
  cargarServicios();
  formularioCita.style.display = "block";
  document.getElementById("nombreCliente").focus();
}

function ocultarFormulario() {
  formularioCita.style.display = "none";
  formCita.reset();
}

function cargarServicios() {
  let serviciosGuardados = localStorage.getItem("servicios");
  let selectServicio = document.getElementById("servicioCita");

  selectServicio.innerHTML = '<option value="">Seleccione un servicio</option>';

  if (serviciosGuardados) {
    let servicios = JSON.parse(serviciosGuardados);
    servicios.forEach((servicio) => {
      let option = document.createElement("option");
      option.value = servicio.id;
      option.textContent = `${servicio.nombre} - $${servicio.precio.toFixed(
        2
      )}`;
      selectServicio.appendChild(option);
    });
  }
}

function agregarCita(event) {
  event.preventDefault();

  let nombreCliente = document.getElementById("nombreCliente").value;
  let fecha = document.getElementById("fechaCita").value;
  let hora = document.getElementById("horaCita").value;
  let servicioId = document.getElementById("servicioCita").value;

  let serviciosGuardados = localStorage.getItem("servicios");
  let servicioSeleccionado = null;

  if (serviciosGuardados && servicioId) {
    let servicios = JSON.parse(serviciosGuardados);
    servicioSeleccionado = servicios.find((s) => s.id == servicioId);
  }

  if (nombreCliente && fecha && hora && servicioSeleccionado) {
    let nuevaCita = {
      id: Date.now(),
      cliente: nombreCliente,
      fecha: fecha,
      hora: hora,
      servicio: {
        id: servicioSeleccionado.id,
        nombre: servicioSeleccionado.nombre,
        precio: servicioSeleccionado.precio,
      },
      estado: "programada",
    };

    citas.push(nuevaCita);
    mostrarCitas();
    guardarCitas();
    ocultarFormulario();
  }
}

function mostrarCitas() {
  console.log("Mostrando citas:", citas);
  listaCitas.innerHTML = "";

  let citasOrdenadas = [...citas].sort((a, b) => {
    let fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
    let fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
    return fechaHoraA - fechaHoraB;
  });

  citasOrdenadas.forEach((cita) => {
    let citaDiv = document.createElement("div");
    citaDiv.className = "item";

    let fechaFormateada = new Date(cita.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    citaDiv.innerHTML = `
    <div class="itemInfo">
        <div><strong>Cliente:</strong> ${cita.cliente}</div>
        <div><strong>Fecha:</strong> ${fechaFormateada}</div>
        <div><strong>Hora:</strong> ${cita.hora}</div>
        ${
          cita.servicio
            ? `
        <div><strong>Servicio:</strong> ${cita.servicio.nombre}</div>
        <div><strong>Precio:</strong> $${cita.servicio.precio.toFixed(2)}</div>
        `
            : ""
        }
        <div class="estado-cita">
            <span class="estado ${cita.estado}">${obtenerTextoEstado(
      cita.estado
    )}</span>
        </div>
    </div>
    <div class="itemActions">
        ${generarBotonesCita(cita)}
        <button onclick="eliminarCita(${
          cita.id
        })" class="deleteButton">Eliminar</button>
    </div>
`;
    listaCitas.appendChild(citaDiv);
  });
}

function eliminarCita(id) {
  citas = citas.filter((cita) => cita.id !== id);
  mostrarCitas();
  guardarCitas();
}

function guardarCitas() {
  localStorage.setItem("citas", JSON.stringify(citas));
}

function cargarCitas() {
  let citasGuardadas = localStorage.getItem("citas");
  if (citasGuardadas) {
    citas = JSON.parse(citasGuardadas);
    citas = citas.map((cita) => {
      if (!cita.estado) {
        cita.estado = "programada";
      }
      return cita;
    });

    console.log("Citas cargadas:", citas);
    mostrarCitas();
  } else {
    console.log("No hay citas guardadas");
  }
}

botonAgregarCita.onclick = mostrarFormulario;
botonCancelar.onclick = ocultarFormulario;
formCita.onsubmit = agregarCita;

formularioCita.onclick = function (event) {
  if (event.target === formularioCita) {
    ocultarFormulario();
  }
};

cargarCitas();

function obtenerTextoEstado(estado) {
  switch (estado) {
    case "programada":
      return "Programada";
    case "completada":
      return "Completada";
    case "cancelada":
      return "Cancelada";
    default:
      return "Programada";
  }
}

function generarBotonesCita(cita) {
  let botones = "";

  if (cita.estado === "programada") {
    botones += `
      <button onclick="completarCita(${cita.id})" class="completeButton">Completar</button>
      <button onclick="cancelarCitaItem(${cita.id})" class="cancelButton">Cancelar</button>
    `;
  } else if (cita.estado === "cancelada") {
    botones += `
      <button onclick="reactivarCita(${cita.id})" class="reactivateButton">Reactivar</button>
    `;
  } else if (cita.estado === "completada") {
    botones += `
      <button onclick="reactivarCita(${cita.id})" class="reactivateButton">Reactivar</button>
    `;
  }

  return botones;
}

function completarCita(id) {
  const cita = citas.find((c) => c.id === id);
  if (cita) {
    cita.estado = "completada";

    if (cita.servicio) {
      agregarPagoAutomatico(cita);
    }

    mostrarCitas();
    guardarCitas();
  }
}

function cancelarCitaItem(id) {
  const cita = citas.find((c) => c.id === id);
  if (
    cita &&
    confirm(`¿Estás seguro de que quieres cancelar la cita de ${cita.cliente}?`)
  ) {
    cita.estado = "cancelada";
    mostrarCitas();
    guardarCitas();
  }
}

function reactivarCita(id) {
  const cita = citas.find((c) => c.id === id);
  if (cita && confirm(`¿Quieres reactivar la cita de ${cita.cliente}?`)) {
    cita.estado = "programada";
    mostrarCitas();
    guardarCitas();
  }
}

function agregarPagoAutomatico(cita) {
  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  let nuevoPago = {
    id: Date.now(),
    tipo: "pago",
    descripcion: `Servicio: ${cita.servicio.nombre} - Cliente: ${cita.cliente}`,
    monto: cita.servicio.precio,
    fecha: new Date().toLocaleDateString(),
  };

  movimientos.push(nuevoPago);
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const hamburger = document.querySelector(".hamburger-menu");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const hamburger = document.querySelector(".hamburger-menu");

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  hamburger.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const overlay = document.querySelector(".sidebar-overlay");
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  if (hamburger) {
    hamburger.addEventListener("click", toggleSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
});
