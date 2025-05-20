document.addEventListener("DOMContentLoaded", function () {
    const recetasContainer = document.getElementById("pacMisRecetas");
    const fragment = document.createDocumentFragment();
    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        recetasContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `http://medicade.involux.es/pacientes/VerMisRecetas/${idPaciente}`;

    // Función para formatear la fecha como: Martes 20 de mayo de 2025 — 05:25
    function formatearFechaHora(fechaStr) {
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const fecha = new Date(fechaStr);
        const diaSemana = dias[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();

        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes} de ${año} | ${hora}:${minutos} h`;
    }

    axios.get(url)
        .then(res => {
            const recetas = res.data;
            console.log(recetas);

            if (recetas.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No se encontraron recetas.";
                recetasContainer.appendChild(mensaje);
            } else {
                recetas.forEach(receta => {
                    const caducidadTexto = receta.caducidad?.toUpperCase() || "DESCONOCIDO";
                    const estadoClase = caducidadTexto === "ACTIVA" ? "activo" :
                                        caducidadTexto === "CADUCADA" ? "inactivo" : "";
                   
                                        // ----- ID---  <h3>Receta ID: ${receta.idReceta}</h3>
                                        /*
                                            <tr class="tablahover">
                                                <td class="izq" >Medicación</td>
                                                <td class="der" style="font-weight: bold;">${receta.medicamento.nombreMedicamento}</td>
                                            </tr>
                                        

                                            <tr class="tablahover">
                                                <td class="izq">Fecha de Inicio</td>
                                                <td>${receta.fechaInicio}</td>
                                            </tr>
                                        */ 
                    
                    const recetaHTML = `
                        <div class="packUnaReceta hover" style="padding:20px 0;">
                            <h3>Receta
                            <br>
                            <span style="font-weight: bold;"> ${receta.medicamento.nombreMedicamento}</span>
                            </h3>
                            <table id="tablaPacMisRecetas" >
                                <tr class="tablahover">
                                    <td colspan="2" style="text-align:center">
                                            Fecha de Inicio
                                            <br>
                                      <strong>      ${formatearFechaHora(receta.fechaInicio)}   </strong> 
                                    </td>
                                </tr>

                                <tr class="tablahover">
                                    <td class="izq">Diagnóstico</td>
                                    <td><span class="infoReceta">${receta.paciente.diagnostico}</span></td>
                                </tr>
                                <tr class="tablahover">
                                    <td class="izq">Duración</td>
                                    <td>${receta.duracionTratamiento} días</td>
                                </tr>
                                <tr class="tablahover">
                                    <td class="izq">Dosis</td>
                                    <td>${receta.dosis} ${receta.medicamento.nombreMedicamento.split(" ").slice(-1)[0]}</td>
                                </tr>
                                <tr class="tablahover">
                                    <td class="izq">Frecuencia</td>
                                    <td>${receta.frecuencia} h</td>
                                </tr>
                                <tr class="tablahover">
                                    <td class="izq">Estado</td>
                                    <td><span class="${estadoClase}">${caducidadTexto}</span></td>
                                </tr>
                            </table>
                        </div>
                    `;

                    const recetaElemento = document.createElement("template");
                    recetaElemento.innerHTML = recetaHTML;
                    fragment.appendChild(recetaElemento.content);
                });

                recetasContainer.appendChild(fragment);
            }
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            const mensaje = document.createElement("p");
            mensaje.textContent = "Hubo un error al cargar las recetas.";
            recetasContainer.appendChild(mensaje);
        });
});
