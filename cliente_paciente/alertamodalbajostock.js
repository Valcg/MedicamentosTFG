document.addEventListener("DOMContentLoaded", () => {
    // ... tu código anterior ...

    let alertasBajoStock = [];  // <-- Acumula alertas aquí

    function verificarMedicamentosCliente() {
        // Reseteamos cada vez
        alertasBajoStock = [];
        huboAlerta = false;
        mostrarMensajeFin = false;
        modalAbierto = false;

        console.log("🔍 Consultando medicamentos del paciente...");
        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const listaMedicamentos = response.data;

                if (!listaMedicamentos || listaMedicamentos.length === 0) {
                    console.warn("⚠️ No se encontraron medicamentos para este paciente.");
                    return;
                }

                let total = listaMedicamentos.length;
                let procesados = 0;

                listaMedicamentos.forEach(med => {
                    verificarStockMedicamento(med.medicamento.idMedicamento, ++procesados === total);
                });
            })
            .catch(err => {
                console.error("❌ Error al obtener medicamentos:", err);
            });
    }

    function verificarStockMedicamento(idMedicamento, esUltimo) {
        axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const data = response.data;

                if (data.mensaje && data.mensaje.toLowerCase().includes("alerta de bajo stock") && data.idAlertaGenerada) {
                    // Guardamos la alerta para mostrar después
                    alertasBajoStock.push({ idAlerta: data.idAlertaGenerada, mensaje: data.mensaje });
                    huboAlerta = true;
                }

                if (esUltimo) {
                    if (huboAlerta) {
                        mostrarModalBajoStockMultiple(alertasBajoStock);
                    } else {
                        mostrarModalSinAlerta();
                    }
                }
            })
            .catch(err => {
                console.error(`❌ Error al verificar stock del medicamento ${idMedicamento}:`, err);
            });
    }

    function mostrarModalBajoStockMultiple(alertas) {
        if (modalAbierto) return;

        // Construimos el HTML con todas las alertas
        let html = '<p>Medicamentos con bajo stock:</p><ul>';
        alertas.forEach(alerta => {
            html += `<li>${alerta.mensaje} <button onclick="confirmarAlertaBajoStock(${alerta.idAlerta})" style="background-color: green; color: white; margin-left: 10px;">Ir</button></li>`;
        });
        html += '</ul>';

        contenidoBajoStock.innerHTML = html;

        modalBajoStock.classList.add("show");
        modalAbierto = true;
        mostrarMensajeFin = false;
    }

    // ... resto de funciones (mostrarModalSinAlerta, confirmarAlertaBajoStock, iniciarTemporizadorConsola) sin cambios ...

});
