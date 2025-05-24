document.addEventListener("DOMContentLoaded", function () {
    const correoInput = document.getElementById("correo");
    const contrasenaInput = document.getElementById("contrasena");
    const btnIniciarSesion = document.getElementById("btnIniciarSesion");
    const togglePassword = document.getElementById("togglePassword");

    // Mostrar/Ocultar contraseña 🟡​
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const tipo = contrasenaInput.getAttribute("type") === "password" ? "text" : "password";
            contrasenaInput.setAttribute("type", tipo);
            this.textContent = tipo === "password" ? "🔐 ⚪" : "🔓 🔵​";
        });
    }

    btnIniciarSesion.addEventListener("click", function (event) {
        event.preventDefault();
        
        const correo = correoInput.value;
        const contrasena = contrasenaInput.value;

        if (!correo || !contrasena) {
            alert("Por favor, ingrese su correo y contraseña.");
            return;
        }

        axios.post("https://medicade-back.involux.es/usuarios/inicioSesion", 
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
                    alert("Error: Tipo de usuario desconocido.");
                }
            } else {
                alert("Error en el inicio de sesión: " + data);
            }
        })
        .catch(err => {
            console.error("Error en la petición:", err);
            alert("Error al iniciar sesión. Verifique sus credenciales.");
        });
    });
});
