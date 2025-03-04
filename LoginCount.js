document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const loginForm = document.querySelector("form");
    const correoInput = document.getElementById("correo");
    const contrasenaInput = document.getElementById("contrasena");
    const btnIniciarSesion = document.getElementById("btnIniciarSesion");

    // Evento para iniciar sesión
    btnIniciarSesion.addEventListener("click", function (event) {
        event.preventDefault();
        
        const correo = correoInput.value;
        const contrasena = contrasenaInput.value;

        if (!correo || !contrasena) {
            alert("Por favor, ingrese su correo y contraseña.");
            return;
        }

        // Realizar petición POST con Axios incluyendo los headers
        axios.post("http://localhost:9050/usuarios/inicioSesion", 
            { correo: correo, contrasena: contrasena },
            { headers: { "Content-Type": "application/json" } }
        )
        .then(res => {
            const data = res.data;
            console.log("Respuesta del servidor:", data);
            
            if (typeof data === "number") {
                localStorage.setItem("idPaciente", data);
                localStorage.setItem("correo", correo);
                window.location.href = "HomeCliente.html"; // Redirigir al dashboard
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
