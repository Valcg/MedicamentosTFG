document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM cargado, iniciando script de verificación de stock...");

    const idPaciente = localStorage.getItem("idUsuario");
    console.log("ID del paciente obtenido de localStorage:", idPaciente);

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

    function verificarMedicamentosCliente() {
        console.log("Iniciando verificación de medicamentos del paciente...");
        alertasBajoStock = [];
        huboAlerta = false;
        modalAbierto = false;

        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const listaMedicamentos = response.data;
                console.log("Medicamentos obtenidos:", listaMedicamentos);
                if (!listaMedicamentos || listaMedicamentos.length === 0) {
                    console.log("No hay medicamentos para este paciente.");
                    return;
                }

                let total = listaMedicamentos.length;
                let procesados = 0;

                listaMedicamentos.forEach(med => {
                    verificarStockMedicamento(
                        med.medicamento.idMedicamento,
                        med.medicamento.nombreMedicamento,
                        ++procesados === total
                    );
                });
            })
            .catch(err => {
                console.error("❌ Error al obtener medicamentos:", err);
            });
    }

    function verificarStockMedicamento(idMedicamento, nombreMedicamento, esUltimo) {
        console.log(`Verificando stock para medicamento ID: ${idMedicamento} (${nombreMedicamento})`);
        axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const mensajeString = response.data;
                console.log(`Respuesta verificación stock para ${nombreMedicamento}:`, mensajeString);

                const mensajeMinuscula = mensajeString.toLowerCase();

                if (mensajeMinuscula.includes("stock suficiente")) {
                    console.log(`Stock suficiente para ${nombreMedicamento}, no se genera alerta.`);
                }
                else if (mensajeMinuscula.includes("se ha generado una alerta de bajostock si es necesario")) {
                    alertasBajoStock.push({
                        idMedicamento: idMedicamento,
                        mensaje: `⚠️ Alerta para ${nombreMedicamento}: Se ha generado una alerta de bajo stock si es necesario.`
                    });
                    huboAlerta = true;
                    console.log(`Alerta detectada para ${nombreMedicamento}`);
                } else {
                    console.log(`Mensaje recibido para ${nombreMedicamento} no genera alerta:`, mensajeString);
                }

                if (esUltimo) {
                    console.log("Último medicamento procesado. ¿Hubo alertas?", huboAlerta);
                    if (huboAlerta) {
                        mostrarModalBajoStockMultiple(alertasBajoStock);
                    }
                }
            })
            .catch(err => {
                console.error(`❌ Error al verificar stock del medicamento ${idMedicamento}:`, err);
            });
    }

    function mostrarModalBajoStockMultiple(alertas) {
        if (modalAbierto) {
            console.log("Modal ya está abierto, no se muestra de nuevo.");
            return;
        }

        console.log("Mostrando modal con alertas:", alertas);
        let html = '<p>Medicamentos con bajo stock:</p><ul>';
        alertas.forEach(alerta => {
            html += `<li>${alerta.mensaje} 
                <button onclick="confirmarAlertaBajoStock(${alerta.idMedicamento})" style="background-color: green; color: white; margin-left: 10px;">Ir</button>
            </li>`;
        });
        html += '</ul>';

        contenidoBajoStock.innerHTML = html;
        modalBajoStock.classList.add("show");
        modalAbierto = true;
    }

    function cerrarModal() {
        console.log("Cerrando modal de alertas.");
        modalBajoStock.classList.remove("show");
        modalAbierto = false;
    }

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => {
            console.log("Botón abrir modal clickeado.");
            if (alertasBajoStock.length > 0) {
                mostrarModalBajoStockMultiple(alertasBajoStock);
            } else {
                contenidoBajoStock.innerHTML = "<p>No hay alertas de bajo stock actualmente.</p>";
                modalBajoStock.classList.add("show");
                modalAbierto = true;
            }
        });
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", cerrarModal);
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", cerrarModal);
    }

    window.confirmarAlertaBajoStock = function (idMedicamento) {
        console.log("Confirmar alerta para medicamento ID:", idMedicamento);
        cerrarModal();

        // Buscar fila y hacer scroll
        const fila = document.getElementById(`fila-${idMedicamento}`);
        if (fila) {
            fila.scrollIntoView({ behavior: "smooth", block: "center" });

            // Resaltar fila en amarillo
            fila.style.backgroundColor = "#fff3b0"; // Amarillo suave

            // Quitar resaltado después de 10 segundos
            setTimeout(() => {
                fila.style.backgroundColor = "";
            }, 10000);
        } else {
            console.warn(`No se encontró la fila para el medicamento con ID ${idMedicamento}`);
        }
    };

    verificarMedicamentosCliente();
});
