document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-contacto");
    const mensaje = document.getElementById("mensaje");
    const selectRelacion = document.getElementById("relacionEnum");

    const idPaciente = localStorage.getItem("idUsuario");

    const selectRelacion = document.getElementById("relacionEnum");
    

    // Verificamos que el select exista antes de usarlo
    if (!selectRelacion) {
        console.error("No se encontró el select con id 'relacionEnum'");
        return;
    }

    // Cargar las opciones del enum
    axios.get("http://localhost:9050/pacientes/relacionesContactoEmergencia")
        .then(response => {
            const relaciones = response.data;

            // Agregar las demás opciones
            relaciones.forEach(relacion => {
                const option = document.createElement("option");
                option.value = relacion;
                option.textContent = relacion.replace("_", " ").toUpperCase();
                selectRelacion.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al obtener las relaciones:", error);
            mensaje.innerHTML = "<p style='color:red;'>No se pudieron cargar las relaciones de contacto.</p>";
        });

    if (!idPaciente) {
        mensaje.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // 🔄 Cargar opciones del enum desde el backend
    axios.get("http://localhost:9050/pacientes/relacionesContactoEmergencia")
        .then(res => {
            const relaciones = res.data;
            relaciones.forEach(rel => {
                const option = document.createElement("option");
                option.value = rel;
                option.textContent = rel.charAt(0) + rel.slice(1).toLowerCase(); // Ej: MADRE → Madre
                selectRelacion.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Error al cargar relaciones:", err);
            mensaje.innerHTML = "<p>Error al cargar las opciones de relación.</p>";
        });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const contactoEmergencia = {
            nombre: document.getElementById("nombre").value,
            telefono: parseInt(document.getElementById("telefono").value),
            relacionEnum: document.getElementById("relacionEnum").value,
            relacionEspecifica: document.getElementById("relacionEspecifica").value,
            comentarios: document.getElementById("comentarios").value,
            correo: document.getElementById("correo").value,
            paciente: {
                idPaciente: parseInt(idPaciente)
            }
        };

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
<<<<<<< HEAD
});
=======

    
});
>>>>>>> dbb6703c894309b65ea550e70e9e0f85d6ab8492
