document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");
    const tabla = document.createElement("table");
    const modal = document.getElementById("modal-confirmar-toma");
    const closeModalBtn = document.getElementById("closeModalConfirmar");
    const confirmarTomaBtn = document.getElementById("confirmarTomaBtn");

    let idAlertaAConfirmar = null; // guardamos temporalmente el id

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

    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        historialContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `http://localhost:9050/pacientes/Vermihistorial/${idPaciente}`;

    function cargarHistorial() {
        axios.get(url)
            .then(res => {
                let historial = res.data;
                if (!historial || historial.length === 0) {
                    historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
                } else {
                    historial.sort((a, b) => new Date(b.fechaHoraToma) - new Date(a.fechaHoraToma));
                    cuerpoTabla.innerHTML = '';

                    historial.forEach(toma => {
                        const fila = document.createElement("tr");

                        const fechaHora = new Date(toma.fechaHoraToma);
                        const dia = fechaHora.getDate().toString().padStart(2, '0');
                        const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
                        const anio = fechaHora.getFullYear();
                        const hora = fechaHora.getHours().toString().padStart(2, '0');
                        const minutos = fechaHora.getMinutes().toString().padStart(2, '0');
                        const fechaHoraFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`;

                        const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                        const nombreMedicamento = toma.alerta?.medicamento?.nombreMedicamento || 'No disponible';

                        let estadoHTML = "";
                        if (estadoAlerta === "confirmado") {
                            estadoHTML = `<td style="color: green;">Confirmada</td>`;
                        } else if (estadoAlerta === "sinConfirmar") {
                            estadoHTML = `<td style="color: red;">Sin Confirmar</td>`;
                        } else {
                            estadoHTML = `<td>${estadoAlerta}</td>`;
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

                        const confirmarBtn = fila.querySelector(".confirm-btn");
                        if (confirmarBtn) {
                            confirmarBtn.addEventListener("click", function () {
                                idAlertaAConfirmar = toma.alerta.idAlerta; // guarda ID
                                modal.style.display = "flex"; // mostrar modal
                            });
                        }
                    });
                }

                if (!historialContainer.contains(tabla)) {
                    historialContainer.appendChild(tabla);
                }
            })
            .catch(err => {
                console.error("Hubo un fallo en la petición: " + err);
                historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            });
    }

    // Evento para cerrar modal
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        idAlertaAConfirmar = null;
    });

    // Evento para confirmar desde el modal
    confirmarTomaBtn.addEventListener("click", function () {
        if (idAlertaAConfirmar) {
            const urlConfirmar = `http://localhost:9050/pacientes/confirmarToma/${idAlertaAConfirmar}`;
            axios.post(urlConfirmar)
                .then(response => {
                    if (response.status === 200) {
                        console.log("Toma confirmada y registrada correctamente.");
                        modal.style.display = "none";
                        idAlertaAConfirmar = null;
                        cargarHistorial(); // recargar datos
                    } else {
                        console.error("Error al confirmar la toma. Código de estado:", response.status);
                        alert("No se pudo confirmar la toma. Intente de nuevo.");
                    }
                })
                .catch(error => {
                    console.error("Error al confirmar la toma:", error);
                    alert("Hubo un error al confirmar la toma. Intente de nuevo.");
                });
        }
    });

    cargarHistorial();
});
