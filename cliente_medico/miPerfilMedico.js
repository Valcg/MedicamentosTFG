document.addEventListener("DOMContentLoaded", function () {
    const perfilContainer = document.getElementById("mi-perfil");
    const fragment = document.createDocumentFragment();
    const numeroColegiado = localStorage.getItem("idUsuario");

    if (!numeroColegiado) {
        perfilContainer.innerHTML = "<p>Error: No se encontró el número de colegiado en localStorage.</p>";
        return;
    }

    const url = `http://medicade.involux.es/medicos/VerMiPerfilMedico/${numeroColegiado}`;

    axios.get(url)
        .then(res => {
            const medico = res.data;
            console.log(medico);

            if (!medico) {
                perfilContainer.innerHTML = "<p>No se encontró el perfil del médico.</p>";
            } else {
                const div = document.createElement("div");
                div.classList.add("perfil-item");

                div.innerHTML = `
                    <h3>Los datos de tu cuenta :</h3>
                    <p>Tipo de Usuario</p>
                    <p class="izq" style="color: #00669C;"> <strong>${medico.usuario.tipoUsuario}</strong> </p> 
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

                // Estado con <a class="infoReceta">
              // Estado sin <a>, conservando clase activa/inactiva
const estadoTitulo = document.createElement("p");
estadoTitulo.textContent = "Estado";

const estadoValor = document.createElement("p");
estadoValor.classList.add("izq");

const estadoTexto = document.createElement("strong");
estadoTexto.textContent = medico.usuario.enabled ? "Activo" : "Inactivo";
estadoTexto.classList.add(medico.usuario.enabled ? "activo" : "inactivo");

estadoValor.appendChild(estadoTexto);
div.appendChild(estadoTitulo);
div.appendChild(estadoValor);
div.appendChild(document.createElement("hr"));

// Especialidad sin <a>, manteniendo clase infoReceta
const especialidadTitulo = document.createElement("p");
especialidadTitulo.textContent = "Especialidad";

const especialidadValor = document.createElement("p");
especialidadValor.classList.add("izq");

const especialidadTexto = document.createElement("strong");
especialidadTexto.textContent = medico.especialidad || "No disponible";
especialidadTexto.classList.add("infoReceta");
especialidadTexto.style.color = "#84CBF1";

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
