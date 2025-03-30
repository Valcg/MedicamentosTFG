// obtenerHistorialDeTomas.js
document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");

    const idPaciente = localStorage.getItem("idUsuario");
    if (!idPaciente) {
        historialContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `http://localhost:9050/pacientes/Vermihistorial/${idPaciente}`;

    axios.get(url)
        .then(res => {
            let historial = res.data;

            if (!historial || historial.length === 0) {
                historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
            } else {
                const tabla = document.createElement("table");
                tabla.innerHTML = `
                    <thead>
                        <tr>
                            <th>Fecha y Hora de Toma</th>
                            <th>Estado de Alerta</th>
                            <th>Nombre del Medicamento</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const cuerpoTabla = tabla.querySelector("tbody");

                historial.sort((a, b) => new Date(b.fechaHoraToma) - new Date(a.fechaHoraToma));

                historial.forEach(toma => {
                    const fila = document.createElement("tr");

                    const fechaHora = new Date(toma.fechaHoraToma);
                    const fechaHoraFormateada = `${fechaHora.getDate().toString().padStart(2, '0')}/${(fechaHora.getMonth() + 1).toString().padStart(2, '0')}/${fechaHora.getFullYear()} ${fechaHora.getHours().toString().padStart(2, '0')}:${fechaHora.getMinutes().toString().padStart(2, '0')}`;

                    const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                    const nombreMedicamento = toma.alerta && toma.alerta.medicamento ? toma.alerta.medicamento.nombreMedicamento : 'No disponible';

                    let estadoHTML = `<td>${estadoAlerta}</td>`;
                    if (estadoAlerta === "confirmado") {
                        estadoHTML = `<td style="color: green;">Confirmada</td>`;
                    }

                    let accionHTML = "<td></td>";
                    if (estadoAlerta === "sinConfirmar") {
                        accionHTML = `<td><button class="confirm-btn">Confirmar</button></td>`;
                    }

                    fila.innerHTML = `
                        <td>${fechaHoraFormateada}</td>
                        ${estadoHTML}
                        <td>${nombreMedicamento}</td>
                        ${accionHTML}
                    `;

                    cuerpoTabla.appendChild(fila);
                });

                historialContainer.appendChild(tabla);
            }
        })
        .catch(err => {
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            console.error("Hubo un fallo en la petición: " + err);
        });
});
