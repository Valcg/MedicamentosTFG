document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");
    const tabla = document.createElement("table");
    tabla.id = "tablapacienteMiHistorial";
    const toast = document.getElementById("toast-confirmacion");

    tabla.innerHTML = `
        <thead>
            <tr>
                <td>Fecha y Hora de Toma</td>
                <td>Nombre del Medicamento</td>
                <td>Estado de Alerta</td>
                <td>  </td>
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

        return {
            fechaTexto: `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes} de ${año}`,
            horaTexto: `${hora}:${minutos}`,
            claveAgrupacion: `${año}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`,
            fechaReal: fecha
        };
    }

    function cargarHistorial() {
        axios.get(url)
            .then(res => {
                let historial = res.data;
                if (!historial || historial.length === 0) {
                    historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
                    return;
                }

                const historialAgrupado = {};

                historial.forEach(toma => {
                    const { fechaTexto, horaTexto, claveAgrupacion, fechaReal } = obtenerFechaYHoraFormateada(toma.fechaHoraToma);
                    if (!historialAgrupado[claveAgrupacion]) {
                        historialAgrupado[claveAgrupacion] = {
                            fechaTexto,
                            fechaReal,
                            tomas: []
                        };
                    }
                    historialAgrupado[claveAgrupacion].tomas.push({
                        ...toma,
                        horaTexto,
                        fechaToma: fechaReal
                    });
                });

                cuerpoTabla.innerHTML = '';

                const clavesOrdenadas = Object.keys(historialAgrupado).sort((a, b) => {
                    return historialAgrupado[b].fechaReal - historialAgrupado[a].fechaReal;
                });

                clavesOrdenadas.forEach(clave => {
                    const grupo = historialAgrupado[clave];

                    const filaTitulo = document.createElement("tr");
                    filaTitulo.innerHTML = `<td colspan="4" style="background-color: #fafafa; padding: 10px;">${grupo.fechaTexto}</td>`;
                    cuerpoTabla.appendChild(filaTitulo);

                    // ✅ Ordenar por hora descendente dentro del día
                    grupo.tomas.sort((a, b) => b.fechaToma - a.fechaToma);

                    grupo.tomas.forEach(toma => {
                        const fila = document.createElement("tr");
                        fila.classList.add("tablahover");
                        const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                        const nombreMedicamento = toma.alerta?.medicamento?.nombreMedicamento || 'No disponible';

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
                            accionHTML = `<td><button class="btnpaconfirmhistorial hover">Confirmar</button></td>`;
                        }

                        fila.id = `alerta-${toma.alerta?.idAlerta || toma.id}`;
                        fila.innerHTML = `
                            <td>${toma.horaTexto}</td>
                            <td>${nombreMedicamento}</td>
                            ${estadoHTML}
                            ${accionHTML}
                        `;

                        cuerpoTabla.appendChild(fila);

                        const confirmarBtn = fila.querySelector(".btnpaconfirmhistorial");
                        if (confirmarBtn) {
                            confirmarBtn.addEventListener("click", function () {
                                const idAlerta = toma.alerta.idAlerta;
                                const urlConfirmar = `http://localhost:9050/pacientes/confirmarToma/${idAlerta}`;

                                axios.post(urlConfirmar)
                                    .then(() => {
                                        let filaMensaje = document.createElement("tr");
                                        filaMensaje.classList.add("mensaje-confirmacion");
                                        filaMensaje.innerHTML = `<td colspan="4" style="color: green; font-weight: bold; text-align: center;">
                                            CONFIRMADO CORRECTAMENTE
                                        </td>`;
                                        fila.parentNode.insertBefore(filaMensaje, fila.nextSibling);

                                        confirmarBtn.disabled = true;
                                        confirmarBtn.textContent = "Confirmado";

                                        const estadoCelda = fila.querySelector("td:nth-child(3)");
                                        if (estadoCelda) {
                                            estadoCelda.innerHTML = `<span class="estadotarde">Confirmado Tarde</span>`;
                                        }

                                        localStorage.setItem("idAlertaConfirmada", idAlerta);

                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 1000);
                                    })
                                    .catch(() => {
                                        localStorage.setItem("idAlertaConfirmada", idAlerta);

                                        let filaError = document.createElement("tr");
                                        filaError.classList.add("mensaje-error");
                                        filaError.innerHTML = `<td colspan="4" style="color: red; font-weight: bold; text-align: center;">
                                            Tienes Bajo Stock de este Medicamento o Esta Receta ya está Caducada
                                        </td>`;
                                        fila.parentNode.insertBefore(filaError, fila.nextSibling);

                                        fila.style.backgroundColor = "#fff3cd";
                                    });
                            });
                        }
                    });
                });

                if (!historialContainer.contains(tabla)) {
                    historialContainer.appendChild(tabla);
                }

                const idAlertaConfirmada = localStorage.getItem("idAlertaConfirmada");
                if (idAlertaConfirmada) {
                    const elemento = document.getElementById("alerta-" + idAlertaConfirmada);
                    if (elemento) {
                        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
                        elemento.style.backgroundColor = "#fffce3";
                        setTimeout(() => {
                            elemento.style.backgroundColor = "";
                        }, 8000);
                    }
                    localStorage.removeItem("idAlertaConfirmada");
                }
            })
            .catch(err => {
                console.error("Hubo un fallo en la petición: " + err);
                historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            });
    }

    if (localStorage.getItem("tomaConfirmada")) {
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 8000);
        localStorage.removeItem("tomaConfirmada");
    }

    cargarHistorial();
});
