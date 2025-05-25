document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, iniciando script de verificación de stock...");

    const idPaciente = localStorage.getItem("idUsuario");
    if (!idPaciente) {
        console.warn("No se encontró ID del paciente en localStorage. Abortando.");
        return;
    }

    let alertasBajoStock = [];
    let huboAlerta = false;
    let modalAbierto = false;

    const modalBajoStock = document.getElementById("modalBajoStock");
    const contenidoBajoStock = document.getElementById("contenidoBajoStock");
    const btnAbrirModal = document.getElementById("btnAbrirBajoStock");
    const btnCerrarModal = document.getElementById("closeModalBajoStockBtn");
    const btnConfirmar = document.getElementById("confirmBtn");

    function obtenerAlertasGuardadas() {
        const datos = localStorage.getItem("alertasBajoStock") || "[]";
        try {
            return JSON.parse(datos);
        } catch {
            return [];
        }
    }

    function guardarAlerta(idMedicamento, idAlerta) {
        const alertas = obtenerAlertasGuardadas();
        if (!alertas.some(a => a.idMedicamento === idMedicamento)) {
            alertas.push({ idMedicamento, idAlerta });
            localStorage.setItem("alertasBajoStock", JSON.stringify(alertas));
            console.log("✔️ Alerta guardada:", { idMedicamento, idAlerta });
        }
    }

    function verificarMedicamentosCliente() {
        console.log("📦 Verificando medicamentos del paciente...");
        alertasBajoStock = [];
        huboAlerta = false;
        modalAbierto = false;

        const alertasLocales = obtenerAlertasGuardadas();

        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const listaMedicamentos = response.data;
                if (!listaMedicamentos?.length) {
                    console.log("No hay medicamentos para este paciente.");
                    return;
                }

                let procesados = 0;

                listaMedicamentos.forEach(med => {
                    const id = med.medicamento.idMedicamento;
                    const nombre = med.medicamento.nombreMedicamento;
                    const alertaLocal = alertasLocales.find(a => a.idMedicamento === id);

                    const finalizarProceso = () => {
                        procesados++;
                        if (procesados === listaMedicamentos.length && huboAlerta) {
                            mostrarModalBajoStockMultiple(alertasBajoStock);
                        }
                    };

                    if (alertaLocal) {
                        console.log(`🔁 Alerta ya registrada para "${nombre}".`);
                        alertasBajoStock.push({ idMedicamento: id, nombreMedicamento: nombre, idAlerta: alertaLocal.idAlerta });
                        huboAlerta = true;
                        finalizarProceso();
                    } else {
                        verificarStockMedicamento(id, nombre, finalizarProceso);
                    }
                });
            })
            .catch(err => console.error("❌ Error al obtener medicamentos:", err));
    }

    function verificarStockMedicamento(idMedicamento, nombreMedicamento, callback) {
        console.log(`🔎 Verificando stock para ${nombreMedicamento} (ID: ${idMedicamento})`);

        axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const resultado = response.data;
                const mensaje = (resultado.mensaje || "").toLowerCase();
                const idAlertaGenerada = resultado.idAlertaGenerada;

                if (mensaje.includes("stock suficiente")) {
                    console.log(`✅ Stock suficiente para ${nombreMedicamento}.`);
                } else if (mensaje.includes("alerta") || resultado.yaExisteAlerta) {
                    alertasBajoStock.push({ idMedicamento, nombreMedicamento, idAlerta: idAlertaGenerada });
                    guardarAlerta(idMedicamento, idAlertaGenerada);
                    huboAlerta = true;
                    console.log(`⚠️ Alerta generada para ${nombreMedicamento}.`);
                } else {
                    console.log(`ℹ️ No se genera alerta para ${nombreMedicamento}.`);
                }
            })
            .catch(err => console.error(`❌ Error al verificar stock de ${nombreMedicamento}:`, err))
            .finally(callback);
    }

    function mostrarModalBajoStockMultiple(alertas) {
        if (modalAbierto) return;
        console.log("📢 Mostrando modal de bajo stock:", alertas);

        contenidoBajoStock.innerHTML = alertas.map(alerta => `
            <p style="text-align:center;">Tienes este Medicamento con Bajo Stock</p>
            <p style="text-align:center;font-weight:bold;">${alerta.nombreMedicamento}</p>
            <p style="text-align:center;">
                <button onclick="confirmarAlertaBajoStock(${alerta.idMedicamento}, ${alerta.idAlerta})" class="BtnAlertaBajoStock hover">
                    Ver Medicamento
                </button>
            </p>
        `).join("");

        modalBajoStock.classList.add("show");
        modalAbierto = true;
    }

    function cerrarModal() {
        modalBajoStock.classList.remove("show");
        modalAbierto = false;
    }

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            if (alertasBajoStock.length > 0) {
                mostrarModalBajoStockMultiple(alertasBajoStock);
            } else {
                contenidoBajoStock.innerHTML = "<p>No hay alertas de bajo stock actualmente.</p>";
                modalBajoStock.classList.add("show");
                modalAbierto = true;
            }
        });
    }

    btnCerrarModal?.addEventListener("click", cerrarModal);
    btnConfirmar?.addEventListener("click", cerrarModal);

    window.confirmarAlertaBajoStock = function (idMedicamento, idAlerta) {
        console.log(`✅ Confirmando alerta para medicamento ID: ${idMedicamento}`);
        cerrarModal();

        axios.post(`http://localhost:9050/pacientes/confirmarAlertaBajoStock/${idAlerta}`)
            .then(resp => {
                console.log("✔️ Alerta confirmada en backend:", resp.data);
                let alertas = obtenerAlertasGuardadas().filter(a => a.idAlerta !== idAlerta);
                localStorage.setItem("alertasBajoStock", JSON.stringify(alertas));
                alertasBajoStock = alertasBajoStock.filter(a => a.idAlerta !== idAlerta);
            })
            .catch(err => console.error("❌ Error confirmando alerta:", err));

        const fila = document.getElementById(`fila-${idMedicamento}`);
        if (fila) {
            fila.scrollIntoView({ behavior: "smooth", block: "center" });
            fila.style.backgroundColor = "#fff3b0";
            setTimeout(() => fila.style.backgroundColor = "", 15000);
        }
    };

    verificarMedicamentosCliente();

    let estadoAnteriorAlertas = localStorage.getItem("alertasBajoStock");

    setInterval(() => {
        const estadoActual = localStorage.getItem("alertasBajoStock");
        if (estadoActual !== estadoAnteriorAlertas) {
            console.warn("🔄 alertasBajoStock ha cambiado.");
            estadoAnteriorAlertas = estadoActual;
            verificarMedicamentosCliente();
        } else {
            console.log("🕒 Sin cambios en alertasBajoStock.");
        }
    }, 60000);

    // Mostrar alertas actuales en consola
    console.log("📋 Alertas guardadas:");
    obtenerAlertasGuardadas().forEach(alerta =>
        console.log(`➡️ idMedicamento: ${alerta.idMedicamento}, idAlerta: ${alerta.idAlerta}`)
    );
});
