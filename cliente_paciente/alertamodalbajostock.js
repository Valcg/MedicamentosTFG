document.addEventListener("DOMContentLoaded", () => {
    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        console.error("❌ Error: No se encontró el ID del paciente en localStorage.");
        return;
    }

    const modalBajoStock = document.getElementById("modalBajoStock");
    const contenidoBajoStock = document.getElementById("contenidoBajoStock");

    let huboAlerta = false;
    let mostrarMensajeFin = false;

    verificarMedicamentosCliente();
    iniciarTemporizadorConsola(180);

    setInterval(() => {
        verificarMedicamentosCliente();
        iniciarTemporizadorConsola(180);
    }, 180000);

    function verificarMedicamentosCliente() {
        axios.get(`https://medicade-back.involux.es/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const listaMedicamentos = response.data;

                if (!listaMedicamentos || listaMedicamentos.length === 0) {
                    console.warn("⚠️ No se encontraron medicamentos para este paciente.");
                    return;
                }

                let total = listaMedicamentos.length;
                let procesados = 0;
                huboAlerta = false;

                listaMedicamentos.forEach(med => {
                    verificarStockMedicamento(med.medicamento.idMedicamento, ++procesados === total);
                });
            })
            .catch(err => {
                console.error("❌ Error al obtener medicamentos:", err);
            });
    }

    function verificarStockMedicamento(idMedicamento, esUltimo) {
        axios.post(`https://medicade-back.involux.es/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const mensaje = response.data;

                if (mensaje.includes("alerta de bajostock")) {
                    console.log(`🚨 Alerta: Medicamento ${idMedicamento} tiene bajo stock.`);
                    huboAlerta = true;
                    mostrarModalBajoStock(idMedicamento, "El stock se ha comprobado correctamente. Tienes bajo stock. NECESITAS AGREGAR STOCK.");
                } else if (esUltimo && !huboAlerta) {
                    if (!mostrarMensajeFin) {
                        console.log("✅ Todos los medicamentos tienen suficiente stock.");
                        mostrarMensajeFin = true;
                        mostrarModalSinAlerta();
                    } else {
                        modalBajoStock.classList.remove("show");
                    }
                }
            })
            .catch(err => {
                console.error("❌ Error al verificar stock del medicamento:", err);
            });
    }

    function mostrarModalBajoStock(idMedicamento, mensaje) {
        console.log(`📢 Mostrando modal de bajo stock para ID ${idMedicamento}`);
        const idAlerta = idMedicamento;

        contenidoBajoStock.innerHTML = `
            <p>${mensaje}</p>
            <button onclick="confirmarAlertaBajoStock(${idAlerta})" style="background-color: green; color: white; margin-right: 10px;">Ir</button>
            <button onclick="posponerAlertaBajoStock(${idAlerta})" style="background-color: orange; color: white;">Posponer</button>
        `;

        modalBajoStock.classList.add("show");
        mostrarMensajeFin = false;
    }

    function mostrarModalSinAlerta() {
        contenidoBajoStock.innerHTML = `
            <p>Ya no hay bajo stock en ningún medicamento.</p>
        `;
        modalBajoStock.classList.add("show");
        setTimeout(() => {
            modalBajoStock.classList.remove("show");
        }, 5000);
    }

    window.confirmarAlertaBajoStock = function(idAlerta) {
        console.log(`🟢 Confirmando alerta para medicamento ID ${idAlerta}`);
        axios.post(`https://medicade-back.involux.es/pacientes/confirmarAlertaBajoStock/${idAlerta}`)
            .then(() => {
                localStorage.setItem("alertaResaltarId", idAlerta); // Guardamos ID para resaltar en la siguiente vista
                window.location.href = "mismedicamentos.html";
            });
    };

    window.posponerAlertaBajoStock = function(idAlerta) {
        console.log(`🟠 Posponiendo alerta para medicamento ID ${idAlerta}`);
        axios.post(`https://medicade-back.involux.es/pacientes/posponerAlertaBajoStock/${idAlerta}`, {})
            .then(res => {
                alert("La alerta se pospondrá 1 minuto.");
                modalBajoStock.classList.remove("show");

                // Reaparece después de 1 minuto
                setTimeout(() => {
                    mostrarModalBajoStock(idAlerta, "Recordatorio: Tienes bajo stock. NECESITAS AGREGAR STOCK.");
                }, 60000);
            })
            .catch(err => {
                alert(err.response?.data || "❌ Error al posponer");
                console.error(err);
            });
    };

    function iniciarTemporizadorConsola(segundos) {
        let tiempoRestante = segundos;

        const intervalId = setInterval(() => {
            console.log(`⏳ Tiempo restante para la próxima verificación: ${tiempoRestante} segundos`);
            tiempoRestante--;

            if (tiempoRestante < 0) {
                clearInterval(intervalId);
                console.log("🔄 Ejecutando nueva verificación de stock...");
            }
        }, 1000);
    }
});
