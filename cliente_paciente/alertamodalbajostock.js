document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM cargado y script iniciado.");

    const idPaciente = localStorage.getItem("idUsuario");
    console.log("ℹ️ idPaciente desde localStorage:", idPaciente);

    if (!idPaciente) {
        console.error("❌ Error: No se encontró el ID del paciente en localStorage.");
        return;
    }

    const modalBajoStock = document.getElementById("modalBajoStock");
    const contenidoBajoStock = document.getElementById("contenidoBajoStock");

    let huboAlerta = false;
    let mostrarMensajeFin = false;
    let modalAbierto = false; // para evitar abrir modal repetidamente

    verificarMedicamentosCliente();
    iniciarTemporizadorConsola(180);

    setInterval(() => {
        console.log("🔁 Intervalo: verificando medicamentos nuevamente...");
        verificarMedicamentosCliente();
        iniciarTemporizadorConsola(180);
    }, 180000);

    function verificarMedicamentosCliente() {
        console.log("🔍 Consultando medicamentos del paciente...");
        axios.get(`https://medicade-back.involux.es/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                console.log("✅ Respuesta medicamentos recibida:", response.data);
                const listaMedicamentos = response.data;

                if (!listaMedicamentos || listaMedicamentos.length === 0) {
                    console.warn("⚠️ No se encontraron medicamentos para este paciente.");
                    return;
                }

                let total = listaMedicamentos.length;
                let procesados = 0;
                huboAlerta = false;

                listaMedicamentos.forEach(med => {
                    console.log(`📋 Verificando medicamento ID: ${med.medicamento.idMedicamento}`);
                    verificarStockMedicamento(med.medicamento.idMedicamento, ++procesados === total);
                });
            })
            .catch(err => {
                console.error("❌ Error al obtener medicamentos:", err);
            });
    }

    function verificarStockMedicamento(idMedicamento, esUltimo) {
        console.log(`🔄 Verificando stock medicamento ID ${idMedicamento}...`);
        axios.post(`https://medicade-back.involux.es/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                console.log(`✅ Respuesta stock medicamento ${idMedicamento}:`, response.data);
                const data = response.data;

                // Detecta si el mensaje contiene alerta de bajo stock y si hay idAlertaGenerada
                if (data.mensaje && data.mensaje.toLowerCase().includes("alerta de bajo stock") && data.idAlertaGenerada) {
                    console.log(`🚨 Alerta: Medicamento ${idMedicamento} tiene bajo stock.`);
                    huboAlerta = true;
                    mostrarModalBajoStock(data.idAlertaGenerada, data.mensaje);
                } else if (esUltimo && !huboAlerta) {
                    if (!mostrarMensajeFin) {
                        console.log("✅ Todos los medicamentos tienen suficiente stock.");
                        mostrarMensajeFin = true;
                        mostrarModalSinAlerta();
                    } else {
                        console.log("ℹ️ No hay alertas y mensaje fin ya mostrado. Ocultando modal.");
                        modalBajoStock.classList.remove("show");
                        modalAbierto = false;
                    }
                } else {
                    console.log(`ℹ️ Medicamento ${idMedicamento} tiene stock suficiente.`);
                }
            })
            .catch(err => {
                console.error(`❌ Error al verificar stock del medicamento ${idMedicamento}:`, err);
            });
    }

    function mostrarModalBajoStock(idAlerta, mensaje) {
        if (modalAbierto) return;  // Evita abrir más de un modal a la vez

        console.log(`📢 Mostrando modal de bajo stock para alerta ID ${idAlerta}`);

        contenidoBajoStock.innerHTML = `
            <p>${mensaje}</p>
            <button onclick="confirmarAlertaBajoStock(${idAlerta})" style="background-color: green; color: white; margin-right: 10px;">Ir</button>
        `;

        modalBajoStock.classList.add("show");
        modalAbierto = true;
        mostrarMensajeFin = false;
    }

    function mostrarModalSinAlerta() {
        if (modalAbierto) return;

        console.log("ℹ️ Mostrando modal sin alertas de bajo stock.");
        contenidoBajoStock.innerHTML = `
            <p>Ya no hay bajo stock en ningún medicamento.</p>
        `;
        modalBajoStock.classList.add("show");
        modalAbierto = true;

        setTimeout(() => {
            console.log("⌛ Ocultando modal sin alertas después de 5 segundos.");
            modalBajoStock.classList.remove("show");
            modalAbierto = false;
        }, 5000);
    }

    window.confirmarAlertaBajoStock = function(idAlerta) {
        console.log(`🟢 Confirmando alerta para ID alerta ${idAlerta}`);
        axios.post(`https://medicade-back.involux.es/pacientes/confirmarAlertaBajoStock/${idAlerta}`)
            .then(() => {
                console.log(`✅ Alerta confirmada para ID alerta ${idAlerta}. Redirigiendo...`);
                localStorage.setItem("alertaResaltarId", idAlerta);
                window.location.href = "mismedicamentos.html";
            })
            .catch(err => {
                console.error(`❌ Error al confirmar alerta para ID alerta ${idAlerta}:`, err);
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
