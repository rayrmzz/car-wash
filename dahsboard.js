document.addEventListener("DOMContentLoaded", function () {
  cargarDashboard();
});

function cargarDashboard() {
  mostrarResumen();
  mostrarCitasProximas();
}

function mostrarResumen() {
  const resumenSection = document.getElementById("resumen");

  const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
  const citas = JSON.parse(localStorage.getItem("citas")) || [];
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

  const totalServicios = servicios.length;
  const totalCitas = citas.length;

  let totalIngresos = 0;
  let totalGastos = 0;

  movimientos.forEach((mov) => {
    if (mov.tipo === "pago") {
      totalIngresos += mov.monto;
    } else if (mov.tipo === "gasto") {
      totalGastos += mov.monto;
    }
  });

  const balance = totalIngresos - totalGastos;

  resumenSection.innerHTML = `
        <h2>Resumen del Negocio</h2>
        <div class="summary-cards">
            <div class="summary-card">
                <h3>Servicios</h3>
                <div class="summary-number">${totalServicios}</div>
                <p>Servicios disponibles</p>
            </div>
            <div class="summary-card">
                <h3>Citas</h3>
                <div class="summary-number">${totalCitas}</div>
                <p>Citas programadas</p>
            </div>
            <div class="summary-card">
                <h3>Ingresos</h3>
                <div class="summary-number">$${totalIngresos.toFixed(2)}</div>
                <p>Total de ingresos</p>
            </div>
            <div class="summary-card">
                <h3>Gastos</h3>
                <div class="summary-number">$${totalGastos.toFixed(2)}</div>
                <p>Total de gastos</p>
            </div>
            <div class="summary-card ${balance >= 0 ? "positive" : "negative"}">
                <h3>Balance</h3>
                <div class="summary-number">$${balance.toFixed(2)}</div>
                <p>${balance >= 0 ? "Ganancia" : "Pérdida"}</p>
            </div>
        </div>
    `;
}

function mostrarCitasProximas() {
  const citasProximasSection = document.getElementById("citasProximas");

  const citas = JSON.parse(localStorage.getItem("citas")) || [];

  if (citas.length === 0) {
    citasProximasSection.innerHTML = `
            <h2>Próximas Citas</h2>
            <div class="no-appointments">
                <p>No hay citas programadas</p>
            </div>
        `;
    return;
  }

  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  const citasFuturas = citas
    .filter((cita) => {
      const fechaCita = new Date(cita.fecha);
      return fechaCita >= fechaActual;
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha + " " + a.hora);
      const fechaB = new Date(b.fecha + " " + b.hora);
      return fechaA - fechaB;
    });

  const proximasCitas = citasFuturas.slice(0, 5);

  let citasHTML = "<h2>Próximas Citas</h2>";

  if (proximasCitas.length === 0) {
    citasHTML += `
            <div class="no-appointments">
                <p>No hay citas próximas programadas</p>
            </div>
        `;
  } else {
    citasHTML += '<div class="upcoming-appointments">';

    proximasCitas.forEach((cita) => {
      const fechaCita = new Date(cita.fecha);
      const fechaFormateada = fechaCita.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);

      let etiquetaFecha = "";
      if (fechaCita.getTime() === hoy.getTime()) {
        etiquetaFecha = '<span class="today-label">HOY</span>';
      } else if (fechaCita.getTime() === manana.getTime()) {
        etiquetaFecha = '<span class="tomorrow-label">MAÑANA</span>';
      }

      citasHTML += `
                <div class="appointment-item">
                    <div class="appointment-time">
                        <div class="time">${cita.hora}</div>
                        <div class="date">${fechaFormateada}</div>
                        ${etiquetaFecha}
                    </div>
                    <div class="appointment-client">
                        <strong>${cita.cliente}</strong>
                    </div>
                </div>
            `;
    });

    citasHTML += "</div>";

    if (citasFuturas.length > 5) {
      citasHTML += `<p class="more-appointments">Y ${
        citasFuturas.length - 5
      } citas más...</p>`;
    }
  }

  citasProximasSection.innerHTML = citasHTML;
}

function actualizarDashboard() {
  cargarDashboard();
}

window.addEventListener("storage", function (e) {
  if (e.key === "servicios" || e.key === "citas" || e.key === "movimientos") {
    actualizarDashboard();
  }
});
