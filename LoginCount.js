document.addEventListener("DOMContentLoaded", function () {
    const correoInput = document.getElementById("correo");
    const contrasenaInput = document.getElementById("contrasena");
    const btnIniciarSesion = document.getElementById("btnIniciarSesion");
    const togglePassword = document.getElementById("togglePassword");
    const mensajeLogin = document.getElementById("mensajeLogin"); // 🔴 Asegúrate de tener este div en tu HTML

    // Mostrar/Ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const tipo = contrasenaInput.getAttribute("type") === "password" ? "text" : "password";
            contrasenaInput.setAttribute("type", tipo);
            this.textContent = tipo === "password" ? "🔐 ⚪" : "🔓 🔵​";
        });
    }

    btnIniciarSesion.addEventListener("click", function (event) {
        event.preventDefault();
        
        mensajeLogin.textContent = "";
        mensajeLogin.style.color = "";

        const correo = correoInput.value;
        const contrasena = contrasenaInput.value;

        if (!correo || !contrasena) {
            mensajeLogin.textContent = "Por favor, ingrese su correo y contraseña.";
            mensajeLogin.style.color = "#f14343";
            return;
        }

        axios.post("http://localhost:9050/usuarios/inicioSesion", 
            { correo: correo, contrasena: contrasena },
            { headers: { "Content-Type": "application/json" } }
        )
        .then(res => {
            const data = res.data;
            console.log("Respuesta del servidor:", data);
            
            if (typeof data === "object" && data.tipoUsuario) {
                const tipoUsuario = data.tipoUsuario.toUpperCase();
                const idUsuario = data.id;

                localStorage.setItem("idUsuario", idUsuario);
                localStorage.setItem("correo", correo);
                localStorage.setItem("tipoUsuario", tipoUsuario);

                if (tipoUsuario === "PACIENTE") {
                    window.location.href = "HomeCliente.html";
                } else if (tipoUsuario === "MEDICO") {
                    window.location.href = "HomeMedico.html";
                } else {
                    mensajeLogin.textContent = "Error: Tipo de usuario desconocido.";
                    mensajeLogin.style.color = "#f14343";
                }
            } else {
                mensajeLogin.textContent = "Error de credenciales";
                mensajeLogin.style.color = "#f14343";
            }
        })
        .catch(err => {
            console.error("Error en la petición:", err);
            mensajeLogin.textContent = "Error de credenciales";
            mensajeLogin.style.color = "#f14343";
        });
    });
});
