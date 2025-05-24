document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "http://localhost:9050/medicos";
    const unicoContainer = document.getElementById("medicoseccionasociarpaciente"); // ID correcto del contenedor

    // Obtener el número de colegiado desde localStorage
    const numeroColegiado = localStorage.getItem("idUsuario");

    // Verificar si existe el número de colegiado
    if (!numeroColegiado) {
        unicoContainer.innerHTML = "<p>No se encontró el número de colegiado. Asegúrate de iniciar sesión.</p>";
        return;
    }

    // Función para asociar un paciente
    function asociarPaciente() {
        // HTML del formulario
        const formularioHtml = `
            <input type="hidden" id="numeroColegiado" value="${numeroColegiado}" required readonly>

            <label for="correoPaciente">Correo del Paciente</label>
            <input type="email" class="input" id="correoPaciente" required>

            <button id="btnAsociarPaciente">Asociar Paciente</button>
            <div id="mensajeAsociacion"></div>
        `;

        // Insertar el formulario en el contenedor
        unicoContainer.innerHTML = formularioHtml;

        // Obtener elementos del formulario
        const correoPacienteField = document.getElementById("correoPaciente");
        const numeroColegiadoField = document.getElementById("numeroColegiado");
        const mensajeAsociacion = document.getElementById("mensajeAsociacion");

        // Asignar el número de colegiado y dejarlo como solo lectura
        numeroColegiadoField.value = numeroColegiado;
        numeroColegiadoField.setAttribute("readonly", true);

        // Función para enviar la asociación de paciente
        function enviarAsociacion() {
            const correo = correoPacienteField.value.trim();

            // Validar que los campos no estén vacíos
            if (!numeroColegiado || !correo) {
                mensajeAsociacion.innerHTML = "<p style='color: #f14343;'>Por favor, complete todos los campos.</p>";
                mensajeAsociacion.classList.add('visible');
                return;
            }

            // Realizar la solicitud para asociar al paciente
            axios.post(`${baseURL}/asociarPaciente/${numeroColegiado}?correo=${correo}`)
                .then(response => {
                    // Mostrar mensaje de éxito
                    mensajeAsociacion.innerHTML = `<p style="color: #66b794f1;">Éxito: ${response.data}</p>`;
                    mensajeAsociacion.classList.add('visible');

                    // Recargar la página después de 1 segundo
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            mensajeAsociacion.innerHTML = `<p style="color: #00669C;">El paciente ya se encuentra asociado a este médico</p>`;
                        } else if (error.response.status === 400) {
                            mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error. Este paciente no está registrado o no existe ninguna cuenta asociada a este correo</p>`;
                        } else {
                            mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error al asociar paciente. Código de error: ${error.response.status}</p>`;
                        }
                    } else {
                        mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error al intentar conectar con el servidor</p>`;
                    }
                    mensajeAsociacion.classList.add('visible');
                    console.error(error);
                });
        }

        // Asociar el evento al botón
        document.getElementById("btnAsociarPaciente").addEventListener("click", enviarAsociacion);
    }

    // Ejecutar función principal
    asociarPaciente();
});
