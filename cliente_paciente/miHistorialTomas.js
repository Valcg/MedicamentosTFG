document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");
    const tabla = document.createElement("table");
    tabla.id = "tablapacienteMiHistorial";
    const modal = document.getElementById("modal-confirmar-toma");
    const closeModalBtn = document.getElementById("closeModalConfirmar");
    const confirmarTomaBtn = document.getElementById("confirmarTomaBtn");

    let idAlertaAConfirmar = null;

    tabla.innerHTML = `
        <thead>
            <tr>
                <td>Fecha y Hora de Toma</td>
                <td>Estado de Alerta</td>
                <td>Nombre del Medicamento</td>
                <td>Acción</td>
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

    const url = `http://medicade.involux.es/pacientes/Vermihistorial/${idPaciente}`;

    function obtenerFechaYHoraFormateada(fechaStr) {
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const fecha = new Date(fechaStr);
        const diaSemana = dias[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        const fechaTexto = `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes} de ${año}`;
        const horaTexto = `${hora}:${minutos}`;
        const claveAgrupacion = `${año}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

        return {
            fechaTexto,
            horaTexto,
            claveAgrupacion
        };
    }

    function cargarHistorial() {
        axios.get(url)
            .then(res => {
                let historial = res.data;
                console.log("Historial completo recibido:", res.data); 
                if (!historial || historial.length === 0) {
                    historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
                } else {
                    const historialAgrupado = {};

                    historial.forEach(toma => {
                        const { fechaTexto, horaTexto, claveAgrupacion } = obtenerFechaYHoraFormateada(toma.fechaHoraToma);
                        if (!historialAgrupado[claveAgrupacion]) {
                            historialAgrupado[claveAgrupacion] = {
                                fechaTexto,
                                tomas: []
                            };
                        }
                        historialAgrupado[claveAgrupacion].tomas.push({
                            ...toma,
                            horaTexto
                        });
                    });

                    cuerpoTabla.innerHTML = '';

                    for (const clave in historialAgrupado) {
                        const grupo = historialAgrupado[clave];

                        const filaTitulo = document.createElement("tr");
                        filaTitulo.innerHTML = `<td colspan="4" style="background-color: white; padding: 10px;">${grupo.fechaTexto}</td>`;
                        cuerpoTabla.appendChild(filaTitulo);

                        grupo.tomas.forEach(toma => {
                            const fila = document.createElement("tr");

                            const fechaHoraFormateada = `${toma.horaTexto}`;
                            const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                            const nombreMedicamento = toma.alerta?.medicamento?.nombreMedicamento || 'No disponible';

                            // NUEVO: span con clases según estado
                            let estadoHTML = "";
                            if (estadoAlerta === "confirmado") {
                                estadoHTML = `<td><span class="estadoact">Confirmado</span></td>`;
                            } else if (estadoAlerta === "sinConfirmar") {
                                estadoHTML = `<td><span class="estadoinact">Sin Confirmar</span></td>`;
                            } else if (estadoAlerta === "confirmadaTarde") {
                                estadoHTML = `<td><span class="estadotarde">Confirmado Tarde</span></td>`;
                            } else {
                                estadoHTML = `<td><span>${estadoAlerta}</span></td>`;
                            }

                            let accionHTML = "<td></td>";
                            if (estadoAlerta === "sinConfirmar") {
                                accionHTML = `<td><button class="confirm-btn" style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer;">Confirmar</button></td>`;
                            }

                            fila.innerHTML = `
                                <td >${fechaHoraFormateada}</td>
                                ${estadoHTML}
                                <td>${nombreMedicamento}</td>
                                ${accionHTML}
                            `;

                            cuerpoTabla.appendChild(fila);

                            const confirmarBtn = fila.querySelector(".confirm-btn");
                            if (confirmarBtn) {
                                confirmarBtn.addEventListener("click", function () {
                                    idAlertaAConfirmar = toma.alerta.idAlerta;
                                    modal.style.display = "flex";
                                });
                            }
                        });
                    }
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

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        idAlertaAConfirmar = null;
    });

    confirmarTomaBtn.addEventListener("click", function () {
        if (idAlertaAConfirmar) {
            const urlConfirmar = `http://medicade.involux.es/pacientes/confirmarToma/${idAlertaAConfirmar}`;
            axios.post(urlConfirmar)
                .then(response => {
                    if (response.status === 200) {
                        console.log("Toma confirmada y registrada correctamente.");
                        modal.style.display = "none";
                        idAlertaAConfirmar = null;
                        cargarHistorial();
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
