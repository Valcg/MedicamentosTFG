document.addEventListener("DOMContentLoaded", function () {
    // ELEMENTOS DE MANEJO DE DOM
    const medicosContainer = document.getElementById("pacVerMisMedicos");
    const fragment = document.createDocumentFragment();

    // OBTENER EL idPaciente DESDE localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    // VALIDAR QUE EL idPaciente EXISTA
    if (!idPaciente) {
        medicosContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // Construir la URL con el idPaciente
    const url = `http://medicade.involux.es/pacientes/VermisMedicos/${idPaciente}`;

    // PETICIÓN GET CON AXIOS PARA OBTENER LOS MÉDICOS DEL PACIENTE
    axios.get(url)
        .then(res => {
            const medicos = res.data; // DATOS DE LOS MÉDICOS
            console.log(medicos); // Verifica los datos que estás recibiendo

            // SI NO HAY MÉDICOS, MOSTRAR MENSAJE
            if (!medicos || medicos.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay médicos disponibles.";
                medicosContainer.appendChild(mensaje);
            } else {
                // RECORREMOS CADA MÉDICO OBTENIDO
                medicos.forEach(medico => {
                    // ACCEDER A `medico.usuario` PARA OBTENER DATOS PERSONALES

                    /* <p>Nombre:</p> 
                       <p>${medico.usuario.nombre} ${medico.usuario.apellido} </p>*/

                    const medicoHTML = `
                    <div class="pacUnMedico hover" style="padding:20px 0;">
                        <div style="width:70%">
                         <h3>
                            Médico
                            <br>
                            <strong> ${medico.usuario.nombre} ${medico.usuario.apellido} </strong>
                         </h3>
                                
                            <p>Especialidad</p> 
                            <p class="izq"> <span class="infoReceta">${medico.especialidad} <span></p>
                                <hr>
                            <p>Email</p> 
                            <p class="izq"> <strong> ${medico.usuario.correo} </strong></p>
                              <hr>
                            <p>Nombre</p> 
                            <p class="izq"> <strong>${medico.usuario.nombre}  </strong> </p>
                              <hr>
                            <p>Apellido</p> 
                            <p class="izq"> <strong>${medico.usuario.apellido}  </strong> </p>
                                <hr>
                            <p>Número Colegiado</p> 
                            <p class="izq"> <strong  style ="color:#00669C;">${medico.numeroColegiado}  </strong> </p>

                       
                     <div>
                     </div>
                    `;

                    const template = document.createElement("template");
                    template.innerHTML = medicoHTML;
                    fragment.appendChild(template.content);
                });
            }

            // AGREGAR EL FRAGMENTO AL DOM
            medicosContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            medicosContainer.innerHTML = "<p>Error al cargar los médicos.</p>";
        });
});
