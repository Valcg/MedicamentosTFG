// Código JavaScript igual al que ya tienes
document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "https://medicade-back.involux.es/medicos";
    const unicoContainer = document.getElementById("medicoseccionasociarpaciente"); // Usar el id correcto 'unico'

    // Obtener el número de colegiado desde localStorage
    const numeroColegiado = localStorage.getItem("idUsuario");

    // Verificar si existe el número de colegiado
    if (!numeroColegiado) {
        unicoContainer.innerHTML = "<p>No se encontró el número de colegiado. Asegúrate de iniciar sesión.</p>";
        return;
    }

    // Función para asociar un paciente
    function asociarPaciente() {
        // Aquí va el HTML que quieres agregar, con los campos necesarios
        const formularioHtml = `
            <input type="hidden" id="numeroColegiado" value="${numeroColegiado}" required readonly>

            <label for="correoPaciente">Correo del Paciente</label>
            <input type="email" class="input" id="correoPaciente" required>

            <button id="btnAsociarPaciente">Asociar Paciente</button>
            <div id="mensajeAsociacion"></div>
        `;

        // Insertar el formulario en el contenedor 'unico'
        unicoContainer.innerHTML = formularioHtml;

        // Seleccionar los campos del formulario
        const correoPacienteField = document.getElementById("correoPaciente");
        const numeroColegiadoField = document.getElementById("numeroColegiado");
        const mensajeAsociacion = document.getElementById("mensajeAsociacion");

        // Verificar si el número de colegiado existe en localStorage
        if (!numeroColegiado) {
            mensajeAsociacion.innerHTML = "<p style='color: #f14343;'>Error: No se encontró el número de colegiado en localStorage</p>";
            mensajeAsociacion.classList.add('visible'); // Hacer visible el mensaje de error
            return;
        }

        // Asignar el número de colegiado al campo correspondiente en el formulario
        numeroColegiadoField.value = numeroColegiado;
        numeroColegiadoField.setAttribute("readonly", true);

        // Función para enviar la asociación de paciente
        function enviarAsociacion() {
            const correo = correoPacienteField.value;

            // Validar que los campos no estén vacíos
            if (!numeroColegiado || !correo) {
                mensajeAsociacion.innerHTML = "<p style='color: #f14343;'>Por favor, complete todos los campos.</p>";
                mensajeAsociacion.classList.add('visible'); // Mostrar mensaje de error
                return;
            }

            // Realizar la solicitud para asociar al paciente
            axios.post(`${baseURL}/asociarPaciente/${numeroColegiado}?correo=${correo}`)
                .then(response => {
                    // Mostrar mensaje de éxito
                    mensajeAsociacion.innerHTML = `<p style="color: #66b794f1;">Éxito: ${response.data}</p>`;
                    mensajeAsociacion.classList.add('visible'); // Hacer visible el mensaje de éxito
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            // El paciente ya está asociado a este médico
                            mensajeAsociacion.innerHTML = `<p style="color: #00669C;">El paciente ya se encuentra asociado a este médico</p>`;
                            mensajeAsociacion.classList.add('visible'); // Mostrar mensaje de nota
                        } else if (error.response.status === 400) {
                            // El paciente no está registrado o no existe
                            mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error.  Este paciente no está registrado o no existe ninguna cuenta asociada a este correo</p>`;
                            mensajeAsociacion.classList.add('visible'); // Mostrar mensaje de error
                        } else {
                            // Otros errores generales
                            mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error al asociar paciente. Código de error: ${error.response.status}</p>`;
                            mensajeAsociacion.classList.add('visible'); // Mostrar mensaje de error
                        }
                    } else {
                        // En caso de que no haya respuesta (error de red o similar)
                        mensajeAsociacion.innerHTML = `<p style="color: #f14343;">Error al intentar conectar con el servidor</p>`;
                        mensajeAsociacion.classList.add('visible'); // Mostrar mensaje de error
                    }
                    console.error(error);
                });
        }

        // Asociar el evento del botón para enviar la asociación
        document.getElementById("btnAsociarPaciente").addEventListener("click", enviarAsociacion);
    }

    // Llamar a la función para mostrar el formulario y asociar al paciente
    asociarPaciente();
});
