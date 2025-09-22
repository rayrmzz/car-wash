const usuarios = {
  admin: "admin123",
  empleado1: "emp123",
  gerente: "ger456",
};

function iniciarSesion(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error-message");

  if (usuarios[usuario] && usuarios[usuario] === password) {
    localStorage.setItem("usuarioLogueado", usuario);
    localStorage.setItem("loginTime", new Date().getTime());
    window.location.href = "index.html";
  } else {
    errorDiv.textContent = "Usuario o contraseña incorrectos";
    errorDiv.className = "error-visible";
    setTimeout(() => {
      errorDiv.className = "error-hidden";
    }, 3000);
  }
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

function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem("loginTime");
  window.location.href = "login.html";
}

let logoutButtons = document.getElementsByClassName("btn btn-logout");

document.getElementById("loginForm").addEventListener("submit", iniciarSesion);
logoutButtons.onclick = cerrarSesion;
