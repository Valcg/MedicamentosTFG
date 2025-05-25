document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM listo");

    const idPaciente = localStorage.getItem("idUsuario");
    if (!idPaciente) {
        console.warn("⚠️ No hay ID de paciente");
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
            console.log("💾 Alerta guardada:", { idMedicamento, idAlerta });
        }
    }

    function verificarMedicamentosCliente() {
        console.log("🔍 Revisando medicamentos...");
        alertasBajoStock = [];
        huboAlerta = false;
        modalAbierto = false;

        const alertasLocales = obtenerAlertasGuardadas();

        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const lista = response.data;
                if (!lista?.length) {
                    console.log("📭 Sin medicamentos");
                    return;
                }

                let procesados = 0;

                lista.forEach(med => {
                    const id = med.medicamento.idMedicamento;
                    const nombre = med.medicamento.nombreMedicamento;
                    const alertaLocal = alertasLocales.find(a => a.idMedicamento === id);

                    const finalizar = () => {
                        procesados++;
                        if (procesados === lista.length && huboAlerta) {
                            mostrarModalBajoStockMultiple(alertasBajoStock);
                        }
                    };

                    if (alertaLocal) {
                        console.log(`🔁 Ya hay alerta: ${nombre}`);
                        alertasBajoStock.push({ idMedicamento: id, nombreMedicamento: nombre, idAlerta: alertaLocal.idAlerta });
                        huboAlerta = true;
                        finalizar();
                    } else {
                        verificarStockMedicamento(id, nombre, finalizar);
                    }
                });
            })
            .catch(err => console.error("❌ Error obteniendo meds:", err));
    }

    function verificarStockMedicamento(idMedicamento, nombreMedicamento, callback) {
        console.log(`📦 Checando stock: ${nombreMedicamento}`);

        axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const res = response.data;
                const mensaje = (res.mensaje || "").toLowerCase();
                const idAlerta = res.idAlertaGenerada;

                if (mensaje.includes("stock suficiente")) {
                    console.log(`✅ OK: ${nombreMedicamento}`);
                } else if (mensaje.includes("alerta") || res.yaExisteAlerta) {
                    alertasBajoStock.push({ idMedicamento, nombreMedicamento, idAlerta });
                    guardarAlerta(idMedicamento, idAlerta);
                    huboAlerta = true;
                    console.log(`⚠️ Baja existencia: ${nombreMedicamento}`);
                } else {
                    console.log(`ℹ️ Sin alerta: ${nombreMedicamento}`);
                }
            })
            .catch(err => console.error(`❌ Error stock ${nombreMedicamento}:`, err))
            .finally(callback);
    }

    function mostrarModalBajoStockMultiple(alertas) {
        if (modalAbierto) return;
        console.log("📢 Mostrando modal", alertas);

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
        console.log(`☑️ Confirmando: ${idMedicamento}`);
        cerrarModal();

        axios.post(`http://localhost:9050/pacientes/confirmarAlertaBajoStock/${idAlerta}`)
            .then(resp => {
                console.log("🗑️ Confirmada:", resp.data);
                let alertas = obtenerAlertasGuardadas().filter(a => a.idAlerta !== idAlerta);
                localStorage.setItem("alertasBajoStock", JSON.stringify(alertas));
                alertasBajoStock = alertasBajoStock.filter(a => a.idAlerta !== idAlerta);
            })
            .catch(err => console.error("❌ Error al confirmar:", err));

        const fila = document.getElementById(`fila-${idMedicamento}`);
        if (fila) {
            fila.scrollIntoView({ behavior: "smooth", block: "center" });
            fila.style.backgroundColor = "#fff3b0";

            setTimeout(() => {
                fila.style.backgroundColor = "";

                // 👇 Ejecutar clic automático en el botón Agregar Stock
                const botonAgregar = fila.querySelector(".btnAgregarStock");
                if (botonAgregar) {
                    console.log("🟢 Ejecutando clic automático en Agregar Stock");
                    botonAgregar.click();

                    // 🔁 Recargar la página después de un pequeño retraso
                    setTimeout(() => {
                        console.log("🔁 Recargando página...");
                        location.reload();
                    }, 1000); // Ajusta el tiempo si es necesario
                } else {
                    console.warn("⚠️ No se encontró el botón Agregar Stock");
                }
            }, 1000);
        }
    };

    verificarMedicamentosCliente();

    let estadoAnteriorAlertas = localStorage.getItem("alertasBajoStock");

    setInterval(() => {
        const estadoActual = localStorage.getItem("alertasBajoStock");
        if (estadoActual !== estadoAnteriorAlertas) {
            console.warn("🔄 Cambio en alertas");
            estadoAnteriorAlertas = estadoActual;
            verificarMedicamentosCliente();
        } else {
            console.log("🕒 Sin cambios");
        }
    }, 60000);

    console.log("📋 Alertas actuales:");
    obtenerAlertasGuardadas().forEach(a =>
        console.log(`➡️ ${a.idMedicamento} | alerta: ${a.idAlerta}`)
    );
});
