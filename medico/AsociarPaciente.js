// URL base para la API
const baseURL = "http://localhost:9050/medicos";

// Función para enviar la asociación de paciente
function enviarAsociacion() {
    const numeroColegiado = document.getElementById("numeroColegiado").value;
    const correo = document.getElementById("correoPaciente").value;

    // Validar que los campos no estén vacíos
    if (!numeroColegiado || !correo) {
        document.getElementById("mensajeAsociacion").innerHTML = "<p style='color: red;'>Por favor, complete todos los campos.</p>";
        return;
    }

    // Realizar la solicitud para asociar al paciente
    axios.post(`${baseURL}/asociarPaciente/${numeroColegiado}?correo=${correo}`)
        .then(response => {
            // Mostrar mensaje de éxito
            document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: green;">Éxito: ${response.data}</p>`;
        })
        .catch(error => {
            // Mostrar mensaje de error
            document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: red;">Error al asociar paciente.</p>`;
            console.error(error);
        });
}

// Asociar el evento del botón para enviar la asociación
document.getElementById("btnAsociarPaciente").addEventListener("click", enviarAsociacion);
