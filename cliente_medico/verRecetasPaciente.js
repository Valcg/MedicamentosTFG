const recetasContainer = document.getElementById("historial-pacientes");

function verRecetasDePaciente(idPaciente, nombrePaciente) {
    const numeroColegiado = localStorage.getItem("idUsuario");
    const correoSesion = localStorage.getItem("correo");  // Obtener correo de sesión

    if (!numeroColegiado) {
        recetasContainer.innerHTML = "<p>Error: no se encontró el número de colegiado.</p>";
        return;
    }

    recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3><p>Cargando...</p>`;

    axios.get(`http://medicade.involux.es/pacientes/VerMisRecetas/${idPaciente}`)
        .then(response => {
            const recetas = response.data;
            console.log(recetas);

            if (!recetas || recetas.length === 0) {
                recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3><p>No hay recetas disponibles.</p>`;
                return;
            }

            let tabla = `<table border="1">
                <thead>
                    <tr>
                        <th>Fecha de Inicio</th>
                        <th>Medicamento</th>
                        <th>Dosis(cantidad ml o mg)</th>
                        <th>Frecuencia (h)</th>
                        <th>Duración (días)</th>
                        <th>Estado</th>
                        <th>Medico</th>
                        <th>Especialidad del Medico</th>
                        <th>Email de Medico</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>`;

            recetas.forEach(receta => {
                const fecha = new Date(receta.fechaInicio).toLocaleString();
                const medicamento = receta.medicamento?.nombreMedicamento || "Sin medicamento";
                const dosis = receta.dosis ?? "No especificada";
                const frecuencia = receta.frecuencia ?? "No especificada";
                const duracion = receta.duracionTratamiento ?? "No especificada";
                const estado = receta.caducidad ?? "Desconocido";
                const medico = receta.medico.usuario.nombre ?? "Desconocido";
                const especialidad = receta.medico.especialidad ?? "Desconocido";
                const emailMedico = receta.medico.usuario.correo ?? "Desconocido";

                const tieneAlertasPendientes = receta.alertas && receta.alertas.some(alerta => alerta.estado === 'sinConfirmar');

                let caducarButton = '';
                if (estado !== "Caducada" && !tieneAlertasPendientes) {
                    if (emailMedico === correoSesion) {
                        // Mismo médico, botón habilitado
                        caducarButton = `<button class="btnCaducar" data-id="${receta.idReceta}">Caducar</button>`;
                    } else {
                        // Otro médico, botón deshabilitado
                        caducarButton = `<button class="btnCaducar" disabled title="Solo el médico que firmó puede caducar esta receta" data-id="${receta.idReceta}">Caducar</button>`;
                    }
                } else {
                    caducarButton = `<span>${estado === "Caducada" ? "Receta caducada" : "Tiene alertas pendientes"}</span>`;
                }

                tabla += `
                    <tr>
                        <td>${fecha}</td>
                        <td>${medicamento}</td>
                        <td>${dosis}</td>
                        <td>${frecuencia}</td>
                        <td>${duracion}</td>
                        <td id="estado_${receta.idReceta}">${estado}</td>
                        <td>${medico}</td>
                        <td>${especialidad}</td>
                        <td>${emailMedico}</td>
                        <td>${caducarButton}</td>
                    </tr>`;
            });

            tabla += `</tbody></table>`;
            recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3>${tabla}`;

            // Solo asignar evento a botones habilitados
            document.querySelectorAll(".btnCaducar:not([disabled])").forEach(button => {
                button.addEventListener("click", function() {
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

// Función para caducar la receta
function caducarReceta(idReceta) {
    axios.post(`http://medicade.involux.es/medicos/CaducarReceta/${idReceta}`)
        .then(response => {
            if (response.status === 200) {
                const estadoCell = document.getElementById(`estado_${idReceta}`);
                estadoCell.textContent = "Caducada";

                const button = document.querySelector(`button[data-id='${idReceta}']`);
                button.disabled = true;

                alert("Receta caducada correctamente");
            }
        })
        .catch(error => {
            console.error("Error al caducar la receta:", error);
            alert("Error al caducar la receta.");
        });
}
