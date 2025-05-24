document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const userTypeSelect = document.getElementById("user-type");
    const extraFieldsContainer = document.getElementById("extra-fields");
    const contrasenaInput = document.getElementById("contrasena");
    const togglePassword = document.getElementById("togglePassword");
    const mensajeRegistro = document.getElementById("mensajeRegistro");

    // Mostrar/ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            const tipo = contrasenaInput.getAttribute("type") === "password" ? "text" : "password";
            contrasenaInput.setAttribute("type", tipo);
            this.textContent = tipo === "password" ? "🔐 ⚪" : "🔓 🔵​";
        });
    }

    // Función para actualizar los campos según el tipo de usuario
    function actualizarCamposExtra() {
        extraFieldsContainer.innerHTML = ""; // Limpiar los campos previos

        const tipoUsuario = userTypeSelect.value;
        if (tipoUsuario === "PACIENTE") {
            extraFieldsContainer.innerHTML = `
                <label for="diagnostico">DIAGNÓSTICO</label>
                <input type="text" id="diagnostico" name="diagnostico" required>
            `;
        } else if (tipoUsuario === "MEDICO") {
            extraFieldsContainer.innerHTML = `
                <label for="numeroColegiado">NÚMERO COLEGIADO</label>
                <input type="text" id="numeroColegiado" name="numeroColegiado" required>

                <label for="especialidad">ESPECIALIDAD</label>
                <input type="text" id="especialidad" name="especialidad" required>
            `;
        }
    }

    // Escuchar cambios en el select
    userTypeSelect.addEventListener("change", actualizarCamposExtra);
    actualizarCamposExtra(); // Ejecutar al cargar la página

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Limpiar mensaje previo
        mensajeRegistro.textContent = "";
        mensajeRegistro.style.color = "";

        const nombre = document.getElementById("name").value;
        const apellido = document.getElementById("apellido").value;
        const dni = document.getElementById("dni").value;
        const correo = document.getElementById("correo").value;
        const contrasena = contrasenaInput.value;
        const tipoUsuario = userTypeSelect.value;

        let usuario = {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            correo: correo,
            contrasena: contrasena,
            tipoUsuario: tipoUsuario
        };

        if (tipoUsuario === "PACIENTE") {
            const diagnostico = document.getElementById("diagnostico").value;
            if (!diagnostico) {
                mensajeRegistro.textContent = "Por favor, ingrese el diagnóstico.";
                mensajeRegistro.style.color = "#f14343";
                return;
            }
            usuario.diagnostico = diagnostico;
        } else if (tipoUsuario === "MEDICO") {
            const numeroColegiado = document.getElementById("numeroColegiado").value;
            const especialidad = document.getElementById("especialidad").value;
            if (!numeroColegiado || !especialidad) {
                mensajeRegistro.textContent = "Por favor, complete los datos del médico.";
                mensajeRegistro.style.color = "#f14343";
                return;
            }
            usuario.numeroColegiado = numeroColegiado;
            usuario.especialidad = especialidad;
        }

        axios.post("http://localhost:9050/usuarios/alta2", usuario, {
            headers: { "Content-Type": "application/json" }
        })
        .then(response => {
            mensajeRegistro.textContent = "✅ Usuario creado correctamente.";
            mensajeRegistro.style.color = "#28a745";
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = "LoginCount.html";
            }, 1000);
        })
        .catch(error => {
            console.error("Error al registrar:", error);
            if (error.response && error.response.status === 409) {
                mensajeRegistro.textContent = "❌ Ya hay un usuario registrado con estos datos.";
            } else {
                mensajeRegistro.textContent = "❌ Error al registrar el usuario.";
            }
            mensajeRegistro.style.color = "#f14343";
        });
    });
});
