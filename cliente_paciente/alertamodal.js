document.addEventListener("DOMContentLoaded", function () {
    const idPaciente = localStorage.getItem("idUsuario");
    const modal = document.getElementById("modalalerta");
    const modalContent = modal.querySelector("p");
    const openModalBtn = document.getElementById("openModalBtn");
    let ultimaAlerta = null;
    let intervaloActualizacion = null;

    if (!idPaciente) {
        console.error("No se encontró el ID del paciente.");
        return;
    }

    const url = `http://localhost:9050/pacientes/VermisAlertas/${idPaciente}`;

    function mostrarModal(alertaProxima = null) {
        if (!alertaProxima) {
            modalContent.innerHTML = "No hay alertas médicas activas en este momento.";
            modal.style.display = "flex";
            return;
        }

        const fechaProx = new Date(alertaProxima.fechaHoraAlerta);
        const nombreProx = alertaProxima.medicamento?.nombreMedicamento || "No disponible";
        const cantidadUnidad = alertaProxima.medicamento?.cantidadUnidad || "No disponible";
        const esSinConfirmar = alertaProxima.estadoAlerta === "sinConfirmar";
        const { fechaTexto, horaTexto } = obtenerFechaYHoraFormateada(alertaProxima.fechaHoraAlerta);
        const horaConfirmada = alertaProxima.horaConfirmacion ? new Date(alertaProxima.horaConfirmacion).toLocaleTimeString() : null;
        const tiempoRestante = fechaProx - new Date();
        const puedeConfirmar = tiempoRestante <= 10 * 60 * 1000;

        const estadoTextoLegible = alertaProxima.estadoAlerta === "confirmado" ? "Confirmado" :
            alertaProxima.estadoAlerta === "sinConfirmar" ? "Sin Confirmar" :
                alertaProxima.estadoAlerta;

        let contenido = `
            <table style="width: 100%; text-align: center; border-collapse: collapse;" class="tabla-alerta-modal">
                <tr>
                    <td colspan="2" style="border-bottom: 1px solid white;"> 
                      <h2>${fechaTexto}<br><strong>${horaTexto} h</strong></h2>
                    </td>
                </tr>
                <tr>
                    <td class="right" style="padding: 10px; text-align: right;">Medicamento</td>
                    <td style="font-weight: bold; padding-left: 10px; text-align: left;">${nombreProx}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; text-align: right;">Estado</td>
                    <td style="padding-left: 10px; text-align: left;">
                        <a id="estadoAlerta" class="${esSinConfirmar ? 'estadoinact' : 'estadoact'}">${estadoTextoLegible}</a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; text-align: right;">Hora de la toma</td>
                    <td style="padding-left: 10px; text-align: left;"><strong>${horaTexto}</strong></td>
                </tr>
                ${horaConfirmada ? `
                <tr>
                    <td style="padding: 10px; text-align: right;">Hora de confirmación</td>
                    <td style="padding-left: 10px; text-align: left;"><strong>${horaConfirmada}</strong></td>
                </tr>` : ''}
                <tr>
                    <td style="padding: 10px; text-align: right;">Total Uds/Stk</td>
                    <td style="padding-left: 10px; text-align: left;"><strong>${cantidadUnidad}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 10px; text-align: right;">Mi STOCK actual</td>
                    <td id="cantidad-stock" style="padding-left: 10px; text-align: left;">Cargando...</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 20px;">
                        ${esSinConfirmar ? `
                        <button id="confirmarAlertaBtn"
                            style="
                                background-color: ${puedeConfirmar ? '#66b794f1' : '#ccc'};
                                color: ${puedeConfirmar ? 'white' : '#666'};
                                border-radius: 16px;
                                padding: 6px 12px;
                                border: none;
                                cursor: ${puedeConfirmar ? 'pointer' : 'not-allowed'};
                            "
                            ${!puedeConfirmar ? 'disabled' : ''}
                        >Confirmar Toma</button>
                        ${!puedeConfirmar ? `
                        <p style="color: #999; font-style: italic; margin-top: 10px;">
                            El botón se habilitará cuando queden 10 minutos antes de la hora de la toma.
                        </p>` : ''}` : `<a style="color:#449a74f1;">YA CONFIRMASTE LA TOMA</a>`}
                    </td>
                </tr>
            </table>
            <p id="mensajeConfirmacion" style="margin:10px 0; line-height: 1.6; text-align:center; "></p>
        `;

        modalContent.innerHTML = contenido;
        modal.style.display = "flex";

        if (esSinConfirmar && puedeConfirmar) {
            document.getElementById("confirmarAlertaBtn").addEventListener("click", function () {
                const urlConfirmar = `http://localhost:9050/pacientes/aceptarToma/${alertaProxima.idAlerta}`;
                axios.post(urlConfirmar)
                    .then(() => {
                        const horaConfirmada = new Date().toLocaleTimeString();
                        const mensaje = document.getElementById("mensajeConfirmacion");
                        mensaje.textContent = `La toma fue confirmada a las ${horaConfirmada}.`;
                        mensaje.style.color = "#66b794f1";
                        document.getElementById("estadoAlerta").textContent = "Confirmado";
                        this.remove();
                        alertaProxima.estadoAlerta = "Confirmada";
                        alertaProxima.horaConfirmacion = new Date().toISOString();
                        setTimeout(() => location.reload(), 1500);
                    })
                    
                    .catch(err => {
                    const mensajeError = document.getElementById("mensajeConfirmacion");
                    mensajeError.innerHTML = `
                        No puedes Confirmar la toma.<br>
                        Por favor revisa tu stock en la sección de Mis Medicamentos.
                    `;
                    mensajeError.style.color = "#f14343";
                    console.error(err);
                     });

            });
        }

        if (puedeConfirmar) {
            if (intervaloActualizacion) clearInterval(intervaloActualizacion);
            intervaloActualizacion = setInterval(() => {
                mostrarModal(alertaProxima);
                actualizarCantidadStock(alertaProxima);
            }, 60000);
        } else {
            clearInterval(intervaloActualizacion);
        }

        actualizarCantidadStock(alertaProxima);
    }

    function actualizarCantidadStock(alertaProxima) {
        if (alertaProxima.medicamento?.idMedicamento) {
            const urlStock = `http://localhost:9050/pacientes/VerCantidadDeMisMedicamentos/pacientes/${idPaciente}/medicamentos/${alertaProxima.medicamento.idMedicamento}`;
            axios.get(urlStock)
                .then(response => {
                    const stock = response.data?.cantidadDisponible ?? "No disponible";
                    document.getElementById("cantidad-stock").innerHTML = `<span class="alertunidades">${stock} Uds/Stk</span>`;
                })
                .catch(() => {
                    document.getElementById("cantidad-stock").innerHTML = `<span class="alertunidades" style="color: red;">Error</span>`;
                });
        } else {
            document.getElementById("cantidad-stock").innerHTML = `<span class="alertunidades" style="color: red;">ID inválido</span>`;
        }
    }

    function obtenerFechaYHoraFormateada(fechaStr) {
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const fecha = new Date(fechaStr);
        const diaSemana = dias[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        return {
            fechaTexto: `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes} de ${año}`,
            horaTexto: `${hora}:${minutos}`
        };
    }

    function verificarAlertas() {
        axios.get(url)
            .then(res => {
                const alertas = res.data;
                const ahora = new Date();

                const alertasFuturas = alertas.filter(alerta => new Date(alerta.fechaHoraAlerta) > ahora);

                const alertaProxima = alertasFuturas.sort((a, b) =>
                    new Date(a.fechaHoraAlerta) - new Date(b.fechaHoraAlerta)
                )[0];

                if (alertaProxima) {
                    ultimaAlerta = alertaProxima;
                    const tiempoRestanteMin = Math.floor((new Date(alertaProxima.fechaHoraAlerta) - ahora) / 60000);
                    const esSinConfirmar = alertaProxima.estadoAlerta === "sinConfirmar";

                    if ((tiempoRestanteMin === 60 || tiempoRestanteMin === 30) && esSinConfirmar) {
                        mostrarModal(alertaProxima);
                    }

                    if (tiempoRestanteMin <= 10 && tiempoRestanteMin >= 0 && esSinConfirmar) {
                        mostrarModal(alertaProxima);
                    }
                }
            })
            .catch(error => {
                console.error("Error al obtener alertas médicas:", error);
            });
    }

    verificarAlertas();
    setInterval(verificarAlertas, 60000);

    openModalBtn.addEventListener("click", function () {
        if (ultimaAlerta) {
            mostrarModal(ultimaAlerta);
        } else {
            modalContent.innerHTML = "No hay alertas médicas activas en este momento.";
            modal.style.display = "flex";
        }
    });

    document.getElementById("closeModalBtn").addEventListener("click", function () {
        modal.style.display = "none";
        clearInterval(intervaloActualizacion);
    });
});
