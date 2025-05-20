document.addEventListener("DOMContentLoaded", function () {
    const perfilContainer = document.getElementById("mi-perfil");
    const fragment = document.createDocumentFragment();
    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        perfilContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `http://medicade-back.involux.es/pacientes/VerMiPerfilPaciente/${idPaciente}`;

    axios.get(url)
        .then(res => {
            const paciente = res.data;
            console.log(paciente);

            if (!paciente) {
                perfilContainer.innerHTML = "<p>No se encontró el perfil del paciente.</p>";
            } else {
                const div = document.createElement("div");
                div.classList.add("perfil-item");

                // HTML estático sin el campo "Estado"
                div.innerHTML = `
                    <h3>Los datos de tu cuenta :</h3>
                    <p>Tipo de Usuario</p>
                    <p class="izq" style="color: #00669C;">  <strong>${paciente.usuario.tipoUsuario}</strong> </p>
                        <hr> 
                    <p>Nombre </p>
                    <p class="izq">     <strong>${paciente.usuario.nombre}</strong> </p>
                        <hr>  
                    <p>Apellidos </p>
                    <p class="izq">    <strong>${paciente.usuario.apellido}</strong> </p>
                        <hr>  
                    <p>Correo electrónico</p>
                    <p class="izq">    <strong>${paciente.usuario.correo}</strong> </p>
                        <hr>  
                    <p>DNI</p>
                    <p class="izq">    <strong>${paciente.usuario.dni} </strong> </p>
                        <hr>  
                `;

                // Campo "Estado" dinámico con color según valor
                const estadoTitulo = document.createElement("p");
                estadoTitulo.textContent = "Estado";

                const estadoValor = document.createElement("p");
                estadoValor.classList.add("izq");
                

                const estadoTexto = document.createElement("strong");
                estadoTexto.textContent = paciente.usuario.enabled ? "Activo" : "Inactivo";
                estadoTexto.classList.add(paciente.usuario.enabled ? "activo" : "inactivo");

                estadoValor.appendChild(estadoTexto);
                div.appendChild(estadoTitulo);
                div.appendChild(estadoValor);
                div.appendChild(document.createElement("hr"));

                // Diagnóstico
// Diagnóstico
const diagnosticoTitulo = document.createElement("p");
diagnosticoTitulo.textContent = "Diagnóstico";

const diagnosticoValor = document.createElement("p");
diagnosticoValor.classList.add("izq");
diagnosticoValor.style.color = "#84CBF1";

const diagnosticoTexto = document.createElement("strong");
diagnosticoTexto.textContent = paciente.diagnostico || "No disponible";
diagnosticoTexto.classList.add("infoReceta"); // <-- AQUÍ AÑADIMOS LA CLASE

diagnosticoValor.appendChild(diagnosticoTexto);
div.appendChild(diagnosticoTitulo);
div.appendChild(diagnosticoValor);


                fragment.appendChild(div);
            }

            perfilContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            perfilContainer.innerHTML = "<p>Hubo un error al cargar el perfil.</p>";
        });
});
