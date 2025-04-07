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

        const fechaProx = new Date(alertaProxima.fechaHoraAlerta).toLocaleString();
        const nombreProx = alertaProxima.medicamento?.nombreMedicamento || "No disponible";

        const contenido = `
            <strong style="color: red;">TU SIGUIENTE TOMA MÁS CERCANA ES:</strong><br><br>
            <strong>Estado:</strong> ${alertaProxima.estadoAlerta}<br>
            <strong>Tipo:</strong> ${alertaProxima.tipoAlerta}<br>
            <strong>Medicamento:</strong> ${nombreProx}<br>
            <strong>Fecha y hora:</strong> ${fechaProx}
        `;

        modalContent.innerHTML = contenido;
        modal.style.display = "flex";
    }

    function verificarAlertas() {
        axios.get(url)
            .then(res => {
                const alertas = res.data;
                const ahora = new Date();

                // Filtrar las alertas futuras (de la misma fecha)
                const alertasFuturas = alertas.filter(alerta => {
                    const fechaAlerta = new Date(alerta.fechaHoraAlerta);
                    return fechaAlerta > ahora;
                });

                // Ordenar las alertas futuras por fecha
                const alertaProxima = alertasFuturas.sort((a, b) => new Date(a.fechaHoraAlerta) - new Date(b.fechaHoraAlerta))[0];

                if (alertaProxima) {
                    ultimaAlerta = alertaProxima;

                    const fechaAlerta = new Date(alertaProxima.fechaHoraAlerta);
                    const diferenciaMin = (fechaAlerta - ahora) / (1000 * 60);

                    // Mostrar automáticamente la alerta más cercana al cargar la página
                    if (!modal.classList.contains("yaMostrada")) {
                        modal.classList.add("yaMostrada");
                        mostrarModal(alertaProxima);
                    }

                    // Si está a 5 minutos o menos, mantener el modal abierto
                    if (diferenciaMin <= 5 && diferenciaMin > 0) {
                        mostrarModal(alertaProxima);
                    }
                }
            })
            .catch(error => {
                console.error("Error al obtener alertas médicas:", error);
            });
    }

    // Verificar al cargar la página
    verificarAlertas();

    // Verificar cada minuto
    setInterval(verificarAlertas, 60000);

    // Botón "Abrir Modal" - siempre muestra la última alerta
    openModalBtn.addEventListener("click", function () {
        if (ultimaAlerta) {
            mostrarModal(ultimaAlerta);
        } else {
            modalContent.innerHTML = "No hay alertas médicas activas en este momento.";
            modal.style.display = "flex";
        }
    });

    // Botones para cerrar la modal
    document.getElementById("closeModalBtn").addEventListener("click", function () {
        modal.style.display = "none";
    });

    document.getElementById("confirmBtn").textContent = "Leído";
    document.getElementById("confirmBtn").addEventListener("click", function () {
        modal.style.display = "none";
    });
});
