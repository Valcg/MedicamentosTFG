document.addEventListener("DOMContentLoaded", function () {
    // OBTENEMOS EL CONTENEDOR DONDE MOSTRAREMOS LAS RECETAS
    const recetasContainer = document.getElementById("axios");
    const fragment = document.createDocumentFragment();

    // OBTENER EL idPaciente DESDE localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    // VALIDAR QUE EL idPaciente EXISTA
    if (!idPaciente) {
        recetasContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // Construir la URL con el idPaciente
    const url = `http://localhost:9050/pacientes/VerMisRecetas/${idPaciente}`;
    // HACEMOS UNA PETICIÓN GET CON AXIOS PARA OBTENER LAS RECETAS DEL PACIENTE
    axios.get(url)
        .then(res => {
            const recetas = res.data; // OBTENEMOS LAS RECETAS DEL PACIENTE
            console.log(recetas); // VERIFICAMOS SI LAS RECETAS SE RECIBEN CORRECTAMENTE

            // VERIFICAMOS SI SE OBTUVIERON LAS RECETAS
            if (recetas.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No se encontraron recetas."; // MENSAJE EN CASO DE NO ENCONTRAR RECETAS
                recetasContainer.appendChild(mensaje);
            } else {
                // CREAMOS UN DIV PARA MOSTRAR LAS RECETAS
                const div = document.createElement("div");
                div.classList.add("recetas-container");

                // RECORREMOS LAS RECETAS Y LAS MOSTRAMOS
                recetas.forEach(receta => {
                    const recetaDiv = document.createElement("div");
                    recetaDiv.classList.add("receta-item");

                    // MOSTRAMOS LOS DETALLES DE CADA RECETA
                    recetaDiv.innerHTML = `
                        <h3>Receta ID: ${receta.idReceta}</h3>
                        <strong>Medicación:</strong> ${receta.medicamento.nombreMedicamento} <br>
                        <strong>Fecha de Receta:</strong> ${receta.fechaInicio} <br>
                        <strong>diagnostico:</strong> ${receta.paciente.diagnostico} <br>
                        <strong>
                        duracionTratamiento:</strong> ${receta.duracionTratamiento} dias <br>
                        <strong>dosis:</strong> ${receta.dosis} <br>
                        <strong>frecuencia:</strong> ${receta.frecuencia} <br>

                          
                    `;

                    // AGREGAMOS CADA RECETA AL DIV PRINCIPAL
                    div.appendChild(recetaDiv);
                });

                // AGREGAMOS EL DIV AL FRAGMENTO PARA OPTIMIZAR EL RENDIMIENTO
                fragment.appendChild(div);
            }

            // AGREGAMOS EL FRAGMENTO AL CONTENEDOR DE LAS RECETAS
            recetasContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err); // MOSTRAMOS ERROR EN CASO DE QUE HAYA FALLADO LA PETICIÓN
            const mensaje = document.createElement("p");
            mensaje.textContent = "Hubo un error al cargar las recetas."; // MENSAJE DE ERROR AL CARGAR LAS RECETAS
            recetasContainer.appendChild(mensaje);
        });
});
