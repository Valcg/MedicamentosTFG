document.addEventListener("DOMContentLoaded", function () {
    // ELEMENTOS DE MANEJO DE DOM
    const medicosContainer = document.getElementById("VerMisMedicos");
    const fragment = document.createDocumentFragment();

    // PETICIÓN GET CON AXIOS PARA OBTENER LOS MÉDICOS DEL PACIENTE CON ID 3
    axios.get("http://localhost:9050/pacientes/VermisMedicos/1")
        .then(res => {
            const medicos = res.data; // DATOS DE LOS MÉDICOS
            console.log(medicos); // Verifica los datos que estás recibiendo

            // SI NO HAY MÉDICOS, MOSTRAR MENSAJE
            if (medicos.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay médicos disponibles.";
                medicosContainer.appendChild(mensaje);
            } else {
                // RECORREMOS CADA MÉDICO OBTENIDO
                medicos.forEach(medico => {
                    const div = document.createElement("div");
                    div.classList.add("medico-item");

                    // ACCESO A `medico.medico` PARA OBTENER `numeroColegiado`, `especialidad`
                    div.innerHTML = `<strong>Nombre:</strong> ${medico.usuario.nombre} ${medico.usuario.apellido} <br>
                           <strong>Número Colegiado:</strong> ${medico.numeroColegiado} <br>
                               <strong>Especialidad:</strong> ${medico.especialidad} <br>
                                      <strong>Email:</strong> ${medico.usuario.correo}`; // email
                    // AGREGAMOS AL FRAGMENTO PARA OPTIMIZAR RENDIMIENTO
                    fragment.appendChild(div);
                });
            }

            // AGREGAR EL FRAGMENTO AL DOM
            medicosContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
