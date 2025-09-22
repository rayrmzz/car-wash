const usuarios = {
  admin: "admin123",
  empleado: "empleado123",
  gerente: "gerente123",
};

function iniciarSesion(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error-message");

  if (usuarios[usuario] && usuarios[usuario] === password) {
    localStorage.setItem("usuarioLogueado", usuario);
    localStorage.setItem("logintime", new Date().getTime());
    window.location.href = "index.html";
  } else {
    errorDiv.textContent = "Usuario o contraseña incorrectos.";
    errorDiv.className = "error-visible";
    setTimeout(() => {
      errorDiv.className = "error-hidden";
    }, 3000);
  }
}

function verificarSesion() {
  const usuario = localStorage.getItem("usuarioLogueado");
  const logintime = localStorage.getItem("logintime");
  const currentTime = new Date().getTime();

  if (!usuario || !logintime || currentTime - logintime > 28800000) {
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("logintime");
    window.location.href = "login.html";
    return false;
  }

  return true;
}

function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  localStorage.removeItem("logintime");
  window.location.href = "login.html";
}

document.getElementById("loginForm").addEventListener("submit", iniciarSesion);
