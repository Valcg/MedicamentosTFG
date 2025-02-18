document.addEventListener("DOMContentLoaded", function () {
    // OBTENEMOS EL CONTENEDOR DONDE MOSTRAREMOS EL PERFIL
    const perfilContainer = document.getElementById("mi-perfil");
    const fragment = document.createDocumentFragment();

    // ID DEL PACIENTE (PUEDES CAMBIAR ESTE ID SEGÚN SEA NECESARIO)
    const pacienteId = 3;

    // HACEMOS UNA PETICIÓN GET CON AXIOS PARA OBTENER EL PERFIL DEL PACIENTE
    axios.get(`http://localhost:9050/pacientes/VerMiPerfil/${pacienteId}`)
        .then(res => {
            const paciente = res.data; // OBTENEMOS LOS DATOS DEL PERFIL DEL PACIENTE
            console.log(paciente); // VERIFICAMOS SI LOS DATOS SE RECIBEN CORRECTAMENTE

            // VERIFICAMOS SI SE OBTUVIERON LOS DATOS DEL PACIENTE
            if (!paciente) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No se encontró el perfil del paciente."; // MENSAJE EN CASO DE NO ENCONTRAR EL PERFIL
                perfilContainer.appendChild(mensaje);
            } else {
                // CREAMOS UN DIV PARA MOSTRAR LOS DATOS DEL PACIENTE
                const div = document.createElement("div");
                div.classList.add("perfil-item");
                div.style.border = "1px solid #ccc"; // AÑADIMOS UN BORDE PARA QUE SE VEA MEJOR
                div.style.padding = "10px"; // AÑADIMOS ESPACIO INTERIOR AL DIV

                // MOSTRAMOS LOS DATOS BÁSICOS DEL PACIENTE EN EL DIV
                div.innerHTML = `
                    <h3>Perfil del Paciente</h3>
                    <strong>ID del Paciente:</strong> ${paciente.idUsuario} <br>
                    <strong>Nombre del Paciente:</strong> ${paciente.nombre} <br>
                    <strong>Apellidos del Paciente:</strong> ${paciente.apellido} <br>
                    <strong>Correo del Paciente:</strong> ${paciente.correo} <br>
                    <strong>DNI:</strong> ${paciente.dni} <br>
                    <strong>Diagnóstico:</strong> ${paciente.paciente.diagnostico} <br>
                    <strong>Estado:</strong> ${paciente.enabled} <br>
                    <strong>Tipo de Usuario:</strong> ${paciente.tipoUsuario} <br>
                `;

                // AGREGAMOS EL DIV AL FRAGMENTO PARA OPTIMIZAR EL RENDIMIENTO
                fragment.appendChild(div);
            }

            // AGREGAMOS EL FRAGMENTO AL CONTENEDOR DEL PERFIL
            perfilContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err); // MOSTRAMOS ERROR EN CASO DE QUE HAYA FALLADO LA PETICIÓN
            const mensaje = document.createElement("p");
            mensaje.textContent = "Hubo un error al cargar el perfil."; // MENSAJE DE ERROR AL CARGAR EL PERFIL
            perfilContainer.appendChild(mensaje);
        });
});
