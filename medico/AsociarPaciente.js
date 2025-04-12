// URL base para la API
const baseURL = "http://localhost:9050/medicos";

// Función para cargar los datos del usuario y prellenar el formulario
function cargarDatosUsuario() {
    // Recuperar el usuario desde sessionStorage
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));

    // Verificar si el usuario existe
    if (usuario) {
        // Asignar el 'numeroColegiado' al campo correspondiente en el formulario
        document.getElementById("numeroColegiado").value = usuario.idUsuario; // El idUsuario es el número de colegiado
    }
}

// Llamar a la función para cargar los datos cuando la página cargue
window.onload = cargarDatosUsuario;

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
            if (error.response) {
                if (error.response.status === 409) {
                    // El paciente ya está asociado a este médico
                    document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: blue;">Nota: El paciente ya se encuentra asociado a este médico.</p>`;
                } else if (error.response.status === 400) {
                    // El paciente no está registrado o no existe
                    document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: red;">Error: Este paciente no está registrado o no existe ninguna cuenta asociada a este correo.</p>`;
                } else {
                    // Otros errores generales
                    document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: red;">Error al asociar paciente. Código de error: ${error.response.status}</p>`;
                }
            } else {
                // En caso de que no haya respuesta (error de red o similar)
                document.getElementById("mensajeAsociacion").innerHTML = `<p style="color: red;">Error al intentar conectar con el servidor.</p>`;
            }
            console.error(error);
        });
}

// Asociar el evento del botón para enviar la asociación
document.getElementById("btnAsociarPaciente").addEventListener("click", enviarAsociacion);
