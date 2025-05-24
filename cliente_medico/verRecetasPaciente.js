const recetasContainer = document.getElementById("historial-pacientes");

function verRecetasDePaciente(idPaciente, nombrePaciente) {
    const numeroColegiado = localStorage.getItem("idUsuario");
    const correoSesion = localStorage.getItem("correo");

    if (!numeroColegiado) {
        recetasContainer.innerHTML = "<p>Error: no se encontró el número de colegiado.</p>";
        return;
    }

    recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3><p>Cargando...</p>`;

    axios.get(`http://localhost:9050/pacientes/VerMisRecetas/${idPaciente}`)
        .then(response => {
            const recetas = response.data;
            console.log(recetas);

            if (!recetas || recetas.length === 0) {
                recetasContainer.innerHTML = `<h2>Recetas de ${nombrePaciente}</h2><p>No hay recetas disponibles.</p>`;
                return;
            }

            let tabla = `<table class="tablaRecetas">
                <thead>
                    <tr>
                        <td>Fecha de Inicio<br>Hora</td>
                        <td>Medicamento<br>(Nom. Cant. U.Med.)</td>
                        <td>Cantidad<br>(Dosis)</td>
                        <td>Frecuencia<br>(H)</td>
                        <td>Días</td>
                        <td>Estado</td>
                        <td>Médico</td>
                        <td>Especialidad</td>
                        <td>Email de Médico</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>`;

            recetas.forEach(receta => {
                const fechaObj = new Date(receta.fechaInicio);
                const opcionesFecha = { day: '2-digit', month: 'long', year: 'numeric' };
                const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

                const fechaTexto = fechaObj.toLocaleDateString('es-ES', opcionesFecha);
                const horaTexto = fechaObj.toLocaleTimeString('es-ES', opcionesHora);

                const fecha = `<div>${fechaTexto}</div><div style="font-size: smaller;">${horaTexto}</div>`;

                const nombreCompleto = receta.medicamento?.nombreMedicamento || "Sin medicamento";
                const match = nombreCompleto.match(/^(.+?)\s(\d+.*)$/);
                let medicamento = '';
                if (match) {
                    medicamento = `<div>${match[1]}</div><div style="font-size: smaller;">${match[2]}</div>`;
                } else {
                    medicamento = `<div>${nombreCompleto}</div>`;
                }

                const dosis = receta.dosis ?? "No especificada";
                const frecuencia = receta.frecuencia ?? "No especificada";
                const duracion = receta.duracionTratamiento ?? "No especificada";
                const estado = receta.caducidad ?? "Desconocido";
                const medico = receta.medico.usuario.nombre ?? "Desconocido";
                const especialidad = receta.medico.especialidad ?? "Desconocido";
                const emailMedico = receta.medico.usuario.correo ?? "Desconocido";

                const claseEstado = estado === "Activa" ? "activa" : (estado === "Caducada" ? "caducada" : "desconocido");

                const tieneAlertasPendientes = receta.alertas && receta.alertas.some(alerta => alerta.estado === 'sinConfirmar');

                let recetaRow = `
                    <tr class="tablahover">
                        <td>${fecha}</td>
                        <td style="font-weight:bold;">${medicamento}</td>
                        <td>${dosis}</td>
                        <td>${frecuencia}</td>
                        <td>${duracion}</td>
                        <td id="estado_${receta.idReceta}">
                            <a class="${claseEstado}">${estado}</a>
                        </td>
                        <td style="color:#00669C;"><a class="infoReceta">${medico}</a></td>
                        <td style="color:#84CBF1;"><a class="infoReceta">${especialidad}</a></td>
                        <td style="color:#00669C;">${emailMedico}</td>`;

                if (estado !== "Caducada" && !tieneAlertasPendientes && emailMedico === correoSesion) {
                    recetaRow += `<td><button class="btnCaducar btnMCaducarReceta" data-id="${receta.idReceta}">Caducar</button></td></tr>`;
                } else if (estado !== "Caducada" && !tieneAlertasPendientes && emailMedico !== correoSesion) {
                    recetaRow += `<td><button class="btnCaducar btnMCaducarReceta" style="opacity:0.2;" disabled title="Solo el médico que firmó puede caducar esta receta" data-id="${receta.idReceta}">Caducar</button></td></tr>`;
                } else {
                    recetaRow += `<td></td></tr>`;
                }

                // Agregar fila de mensaje oculta
                recetaRow += `
                    <tr id="mensaje_${receta.idReceta}" class="mensaje-alerta-receta" style="display: none;">
                        <td colspan="10" style="text-align:center;"></td>
                    </tr>`;

                tabla += recetaRow;
            });

            tabla += `</tbody></table>`;
            recetasContainer.innerHTML = `<h2>Recetas de ${nombrePaciente}</h2>${tabla}`;

            document.querySelectorAll(".btnCaducar:not([disabled])").forEach(button => {
                button.addEventListener("click", function () {
                    const idReceta = this.getAttribute("data-id");
                    caducarReceta(idReceta);
                });
            });

        })
        .catch(error => {
            recetasContainer.innerHTML = "<p>Error al cargar las recetas.</p>";
            console.error(error);
        });
}

function caducarReceta(idReceta) {
    axios.post(`http://localhost:9050/medicos/CaducarReceta/${idReceta}`)
        .then(response => {
            if (response.status === 200) {
                const estadoCell = document.getElementById(`estado_${idReceta}`);
                const linkEstado = estadoCell.querySelector("a");
                linkEstado.textContent = "Caducada";

                linkEstado.classList.remove("activa", "desconocido");
                linkEstado.classList.add("caducada");

                const button = document.querySelector(`button[data-id='${idReceta}']`);
                button.disabled = true;

                const mensajeTr = document.getElementById(`mensaje_${idReceta}`);
                if (mensajeTr) {
                    const td = mensajeTr.querySelector("td");
                    td.textContent = "La receta se caducó Correctamente.";
                    td.style.color = "green";

                    // Pintar la fila de amarillo para indicar actualización #fffce3
                    mensajeTr.style.backgroundColor = "#F0F0F0";

                    mensajeTr.style.display = "table-row";

                    setTimeout(() => {
                        mensajeTr.style.display = "none";
                        // Recargar la página solo después de mostrar el mensaje
                        location.reload();
                    }, 15000); // 15 segundos
                }
            }
        })
        .catch(error => {
            console.error("Error al caducar la receta:", error);

            const mensajeTr = document.getElementById(`mensaje_${idReceta}`);
            if (mensajeTr) {
                const td = mensajeTr.querySelector("td");
                td.textContent = "⚠️ Error: No se puede caducar la receta. Quizá hay alertas pendientes.";
                td.style.color = "#f14343";
                mensajeTr.style.backgroundColor = ""; // Sin color especial
                mensajeTr.style.display = "table-row";

                setTimeout(() => {
                    mensajeTr.style.display = "none";
                }, 15000);
            }
        });
}
