document.addEventListener("DOMContentLoaded", function () {
    // OBTENEMOS EL CONTENEDOR DONDE MOSTRAREMOS EL PERFIL
    const perfilContainer = document.getElementById("mi-perfil");
    const fragment = document.createDocumentFragment();

    // OBTENER EL idPaciente DESDE localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    // VALIDAR QUE EL idPaciente EXISTA
    if (!idPaciente) {
        perfilContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // Construir la URL con el idPaciente
    const url = `http://localhost:9050/pacientes/VerMiPerfilPaciente/1`;

    // HACEMOS UNA PETICIÓN GET CON AXIOS PARA OBTENER EL PERFIL DEL PACIENTE
    axios.get(url)
        .then(res => {
            const paciente = res.data; // OBTENEMOS LOS DATOS DEL PERFIL DEL PACIENTE
            console.log(paciente); // VERIFICAMOS SI LOS DATOS SE RECIBEN CORRECTAMENTE

            // VERIFICAMOS SI SE OBTUVIERON LOS DATOS DEL PACIENTE
            if (!paciente) {
                perfilContainer.innerHTML = "<p>No se encontró el perfil del paciente.</p>";
            } else {
                // CREAMOS UN DIV PARA MOSTRAR LOS DATOS DEL PACIENTE
                const div = document.createElement("div");
                div.classList.add("perfil-item");

                // MOSTRAMOS LOS DATOS BÁSICOS DEL PACIENTE EN EL DIV
                div.innerHTML = `
                    <h3>Los datos de tu cuenta:</h3>
                    <strong>ID del USUARIO:</strong> ${paciente.usuario.idUsuario} <br>
                    <strong>ID del PACIENTE:</strong> ${paciente.idPaciente} <br>
                    <strong>Nombre del Paciente:</strong> ${paciente.usuario.nombre} <br>
                    <strong>Apellidos del Paciente:</strong> ${paciente.usuario.apellido} <br>
                    <strong>Correo del Paciente:</strong> ${paciente.usuario.correo} <br>
                    <strong>DNI:</strong> ${paciente.usuario.dni} <br>
                    <strong>Estado:</strong> ${paciente.usuario.enabled ? "Activo" : "Inactivo"} <br>
                    <strong>Tipo de Usuario:</strong> ${paciente.usuario.tipoUsuario} <br>
                    <strong>Diagnóstico:</strong> ${paciente.diagnostico || "No disponible"} <br>
                `;

                // AGREGAMOS EL DIV AL FRAGMENTO PARA OPTIMIZAR EL RENDIMIENTO
                fragment.appendChild(div);
            }

            // AGREGAMOS EL FRAGMENTO AL CONTENEDOR DEL PERFIL
            perfilContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            perfilContainer.innerHTML = "<p>Hubo un error al cargar el perfil.</p>";
        });
});
