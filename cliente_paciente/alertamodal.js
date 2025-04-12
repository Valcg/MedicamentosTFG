document.addEventListener("DOMContentLoaded", function () {
    const idPaciente = localStorage.getItem("idUsuario");
    const modal = document.getElementById("modalalerta");
    const modalContent = modal.querySelector("p");
    const openModalBtn = document.getElementById("openModalBtn");
    let ultimaAlerta = null;

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
        const ahora = new Date();
        const diferenciaMin = (fechaProx - ahora) / (1000 * 60);
        const nombreProx = alertaProxima.medicamento?.nombreMedicamento || "No disponible";
        const esSinConfirmar = alertaProxima.estadoAlerta === "sinConfirmar";
        const puedeConfirmar = diferenciaMin <= 5;

        let contenido = ` 
            <strong style="color: red;">TU SIGUIENTE TOMA MÁS CERCANA ES:</strong><br><br>
            <strong>Estado:</strong> <span id="estadoAlerta">${alertaProxima.estadoAlerta}</span><br>
            <strong>Tipo:</strong> ${alertaProxima.tipoAlerta}<br>
            <strong>Medicamento:</strong> ${nombreProx}<br>
            <strong>Fecha y hora:</strong> ${fechaProx.toLocaleString()}<br><br>
        `;

        if (esSinConfirmar) {
            contenido += `
                <button id="confirmarAlertaBtn" ${puedeConfirmar ? "" : "disabled"}>
                    Confirmar Toma
                </button>
                <span id="avisoConfirmacion" style="margin-left: 10px; color: gray; font-style: italic;">
                    ${!puedeConfirmar ? "⏳ Cuando queden 5 minutos antes de la alerta se podrá confirmar la toma." : ""}
                </span>
                <p id="mensajeConfirmacion" style="margin-top:10px;"></p>
            `;
        }

        modalContent.innerHTML = contenido;
        modal.style.display = "flex";

        if (esSinConfirmar) {
            const btnConfirmar = document.getElementById("confirmarAlertaBtn");
            const mensaje = document.getElementById("mensajeConfirmacion");
            const aviso = document.getElementById("avisoConfirmacion");

            if (!puedeConfirmar) {
                const interval = setInterval(() => {
                    const ahora = new Date();
                    const diferencia = (fechaProx - ahora) / (1000 * 60);

                    if (diferencia <= 5) {
                        btnConfirmar.disabled = false;
                        if (aviso) aviso.textContent = "";
                        clearInterval(interval);
                    }
                }, 30000); // cada 30 segundos
            }

            btnConfirmar.addEventListener("click", function () {
                const urlConfirmar = `http://localhost:9050/pacientes/aceptarToma/${alertaProxima.idAlerta}`;

                axios.post(urlConfirmar)
                    .then(res => {
                        const horaConfirmada = new Date().toLocaleTimeString();
                        mensaje.textContent = `✅ La toma fue confirmada a las ${horaConfirmada}.`;
                        mensaje.style.color = "green";

                        document.getElementById("estadoAlerta").textContent = "Confirmada";
                        btnConfirmar.remove();
                        if (aviso) aviso.remove();

                        alertaProxima.estadoAlerta = "Confirmada";
                        ultimaAlerta.estadoAlerta = "Confirmada";
                    })
                    .catch(err => {
                        alert("❌ Hubo un error al confirmar la toma.");
                        console.error(err);
                    });
            });
        }
    }

    function verificarAlertas() {
        axios.get(url)
            .then(res => {
                const alertas = res.data;
                const ahora = new Date();

                // 1. Filtrar solo las alertas futuras
                const alertasFuturas = alertas.filter(alerta => {
                    const fechaAlerta = new Date(alerta.fechaHoraAlerta);
                    return fechaAlerta > ahora;
                });

                // 2. Eliminar duplicados por medicamento + fecha
                const alertasFuturasUnicas = alertasFuturas.filter((alerta, index, self) =>
                    index === self.findIndex(a =>
                        a.fechaHoraAlerta === alerta.fechaHoraAlerta &&
                        a.medicamento?.nombreMedicamento === alerta.medicamento?.nombreMedicamento
                    )
                );

                // 3. Ordenar por la fecha más cercana
                const alertaProxima = alertasFuturasUnicas.sort((a, b) =>
                    new Date(a.fechaHoraAlerta) - new Date(b.fechaHoraAlerta)
                )[0];

                if (alertaProxima) {
                    ultimaAlerta = alertaProxima;

                    const fechaAlerta = new Date(alertaProxima.fechaHoraAlerta);
                    const diferenciaMin = (fechaAlerta - ahora) / (1000 * 60);

                    if (!modal.classList.contains("yaMostrada")) {
                        modal.classList.add("yaMostrada");
                        mostrarModal(alertaProxima);
                    }

                    if (diferenciaMin <= 5 && diferenciaMin > 0) {
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
    });

    document.getElementById("confirmBtn").textContent = "Leído";
    document.getElementById("confirmBtn").addEventListener("click", function () {
        modal.style.display = "none";
    });
});
