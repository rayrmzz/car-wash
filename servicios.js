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

let servicios = [];

let botonAgregar = document.getElementById("agregarServicio");
let listaServicios = document.getElementById("listaServicios");
let formularioServicio = document.getElementById("formularioServicio");
let formServicio = document.getElementById("formServicio");
let botonCancelar = document.getElementById("cancelarServicio");

function mostrarFormulario() {
  formularioServicio.style.display = "block";
  document.getElementById("nombreServicio").focus();
}

function ocultarFormulario() {
  formularioServicio.style.display = "none";
  formServicio.reset();
}

function agregarServicio(event) {
  event.preventDefault();

  let nombreServicios = document.getElementById("nombreServicio").value;
  let precio = document.getElementById("precioServicio").value;
  let descripcion = document.getElementById("descripcionServicio").value;

  if (nombreServicios && precio && descripcion) {
    let nuevoServicio = {
      id: Date.now(),
      nombre: nombreServicios,
      precio: parseFloat(precio),
      descripcion: descripcion,
    };

    servicios.push(nuevoServicio);
    mostrarServicios();
    guardarServicios();
    ocultarFormulario();
  }
}

function mostrarServicios() {
  listaServicios.innerHTML = "";

  servicios.forEach((servicio) => {
    let servicioDiv = document.createElement("div");
    servicioDiv.className = "item";
    servicioDiv.innerHTML = `
    <div class="itemInfo">
      <div><strong>Servicio:</strong> ${servicio.nombre}</div>
      <div><strong>Precio:</strong> $${servicio.precio.toFixed(2)}</div>
      <div><strong>Descripción:</strong> ${servicio.descripcion}</div>
    </div>
    <div class="itemActions">
      <button onclick="eliminarServicio(${
        servicio.id
      })" class="deleteButton">Eliminar</button>
    </div>
    `;
    listaServicios.appendChild(servicioDiv);
  });
}

function eliminarServicio(id) {
  servicios = servicios.filter((servicio) => servicio.id !== id);
  mostrarServicios();
  guardarServicios();
}

function guardarServicios() {
  localStorage.setItem("servicios", JSON.stringify(servicios));
}

function cargarServicios() {
  let serviciosGuardados = localStorage.getItem("servicios");
  if (serviciosGuardados) {
    servicios = JSON.parse(serviciosGuardados);
    mostrarServicios();
  }
}

botonAgregar.onclick = mostrarFormulario;
botonCancelar.onclick = ocultarFormulario;
formServicio.onsubmit = agregarServicio;

formularioServicio.onclick = function (event) {
  if (event.target === formularioServicio) {
    ocultarFormulario();
  }
};

cargarServicios();
