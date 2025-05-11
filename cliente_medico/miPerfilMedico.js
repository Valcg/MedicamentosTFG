document.addEventListener("DOMContentLoaded", function () {
    const perfilContainer = document.getElementById("mi-perfil");
    const fragment = document.createDocumentFragment();
    const numeroColegiado = localStorage.getItem("idUsuario");

    if (!numeroColegiado) {
        perfilContainer.innerHTML = "<p>Error: No se encontró el número de colegiado en localStorage.</p>";
        return;
    }

    const url = `http://localhost:9050/medicos/VerMiPerfilMedico/${numeroColegiado}`;

    axios.get(url)
        .then(res => {
            const medico = res.data;
            console.log(medico);

            if (!medico) {
                perfilContainer.innerHTML = "<p>No se encontró el perfil del médico.</p>";
            } else {
                const div = document.createElement("div");
                div.classList.add("perfil-item");

                // HTML estático (sin "Estado")
                div.innerHTML = `
                    <h3>Los datos de tu cuenta :</h3>
                    <p>Tipo de Usuario</p>
                    <p class="izq" style="color:#84CBF1;">     <strong>${medico.usuario.tipoUsuario}</strong> </p> 
                        <hr>    
                    <p>Número de Colegiado</p>
                    <p class="izq">    <strong>${medico.numeroColegiado}</strong> </p>
                        <hr>
                    <p>Nombre</p>
                    <p class="izq">     <strong>${medico.usuario.nombre}</strong> </p>
                        <hr>              
                    <p>Apellidos </p>
                    <p class="izq">     <strong>${medico.usuario.apellido}</strong> </p>
                        <hr>
                    <p>Correo electrónico</p>
                    <p class="izq">     <strong>${medico.usuario.correo}</strong> </p>
                        <hr>
                `;

                // Estado dinámico con color
                const estadoTitulo = document.createElement("p");
                estadoTitulo.textContent = "Estado";

                const estadoValor = document.createElement("p");
                estadoValor.classList.add("izq");

                const estadoTexto = document.createElement("strong");
                estadoTexto.textContent = medico.usuario.enabled ? "Activo" : "Inactivo";
                estadoTexto.style.color = medico.usuario.enabled ? "#66b794f1" : "#f14343";

                estadoValor.appendChild(estadoTexto);
                div.appendChild(estadoTitulo);
                div.appendChild(estadoValor);
                div.appendChild(document.createElement("hr"));

                // Especialidad
                const especialidadTitulo = document.createElement("p");
                especialidadTitulo.textContent = "Especialidad";

                const especialidadValor = document.createElement("p");
                especialidadValor.classList.add("izq");
                especialidadValor.style.color = "#00669C";

                const especialidadTexto = document.createElement("strong");
                especialidadTexto.textContent = medico.especialidad || "No disponible";

                especialidadValor.appendChild(especialidadTexto);
                div.appendChild(especialidadTitulo);
                div.appendChild(especialidadValor);

                fragment.appendChild(div);
            }

            perfilContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            perfilContainer.innerHTML = "<p>Hubo un error al cargar el Perfil Médico</p>";
        });
});
