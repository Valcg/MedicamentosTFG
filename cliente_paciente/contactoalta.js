
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-contacto");
    const mensaje = document.getElementById("mensaje");

    // Obtener el ID del paciente desde localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        mensaje.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evitar que se recargue la página

        // Crear el objeto con los datos del contacto
        const contactoEmergencia = {
            nombre: document.getElementById("nombre").value,
            telefono: parseInt(document.getElementById("telefono").value),
            relacionEnum: document.getElementById("relacionEnum").value.toUpperCase(),
            relacionEspecifica: document.getElementById("relacionEspecifica").value,
            comentarios: document.getElementById("comentarios").value,
            correo: document.getElementById("correo").value,
            paciente: {
                idPaciente: parseInt(idPaciente)
            }
        };

        // Hacer el POST con Axios
        axios.post("http://localhost:9050/pacientes/alta-contacto-emergencia", contactoEmergencia)
            .then(res => {
                mensaje.innerHTML = "<p>Contacto de emergencia guardado con éxito.</p>";
                form.reset();
                console.log("Guardado correctamente:", res.data);
            })
            .catch(err => {
                console.error("Error al guardar contacto:", err);
                mensaje.innerHTML = "<p>Error al guardar el contacto.</p>";
            });
    });
});