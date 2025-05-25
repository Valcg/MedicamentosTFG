document.addEventListener("DOMContentLoaded", function () {
    const idPaciente = localStorage.getItem("idUsuario");
    if (!idPaciente) {
        console.error("Error: No se encontró el ID del paciente en localStorage.");
        return;
    }

    const contenedor = document.getElementById("pacienteMisMedicamentos");

    function cargarMisMedicamentos() {
        const url = `http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`;

        axios.get(url)
            .then(response => {
                const medicamentos = response.data;

                if (!medicamentos || medicamentos.length === 0) {
                    contenedor.innerHTML = "<p>No tienes medicamentos registrados.</p>";
                    return;
                }

                let html = `
                    <table id="tablaMedicamentosPaciente">
                        <tbody>
                            <tr>
                                <td>Nombre del Medicamento</td>
                                <td>Cantidad Disponible</td>
                                <td>Unidad/Caja</td>
                            </tr>
                `;

                medicamentos.forEach(item => {
                    html += `
                        <tr class="tablahover" id="fila-${item.medicamento.idMedicamento}">
                            <td>${item.medicamento.nombreMedicamento}</td>
                            <td id="cantidad-${item.medicamento.idMedicamento}">${item.cantidadDisponible}</td>
                            <td>
                                <input type="number" min="1" value="1" id="input-${item.medicamento.idMedicamento}" style="width: 50px;color:#dac47c;font-weight:bold;" class="input"/>
                                <button class="btnAgregarStock hover" onclick="agregarStock('${idPaciente}', '${item.medicamento.idMedicamento}')">Agregar Stock</button>
                            </td>
                        </tr>
                    `;
                });

                html += `
                        </tbody>
                    </table>
                `;

                contenedor.innerHTML = html;

                // Resaltar fila modificada tras recarga (30 seg)
                const idMedicamentoResaltado = localStorage.getItem("medicamentoResaltado");
                if (idMedicamentoResaltado) {
                    const fila = document.getElementById(`fila-${idMedicamentoResaltado}`);
                    if (fila) {
                        fila.style.backgroundColor = "#fff3b0";
                        setTimeout(() => {
                            fila.style.backgroundColor = "";
                            localStorage.removeItem("medicamentoResaltado");
                        }, 30000);
                    }
                }
            })
            .catch(error => {
                contenedor.innerHTML = "<p>Error al cargar tus medicamentos.</p>";
                console.error("Error al obtener medicamentos del paciente:", error);
            });
    }

    cargarMisMedicamentos();

    window.agregarStock = function (idPaciente, idMedicamento) {
        const input = document.getElementById(`input-${idMedicamento}`);
        const cantidadCajas = parseInt(input.value);

        if (isNaN(cantidadCajas) || cantidadCajas <= 0) {
            mostrarMensaje(idMedicamento, "Ingresa una cantidad válida.", "error");
            return;
        }

        const urlAgregarStock = `http://localhost:9050/pacientes/${idPaciente}/medicamentos/${idMedicamento}/agregar-stock?cantidadCajas=${cantidadCajas}`;
        const urlVerificarStock = `http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`;

        axios.post(urlAgregarStock)
            .then(response => {
                mostrarMensaje(idMedicamento, "Stock agregado correctamente.", "exito");

                // Eliminar alerta local
                eliminarAlertaDeLocalStorage(idMedicamento);

                localStorage.setItem("medicamentoResaltado", idMedicamento);

// Consultar si hay alerta activa para confirmar
                return axios.post(urlVerificarStock).catch(err => {
            console.warn("NOOOO se pudo verificar alerta, pero el stock se agregó.");
            return null; // Evitamos romper el flujo
        });
    })
            .then(responseVerificar => {
                const resultado = responseVerificar.data;
                
                // 🔴 Eliminado confirmación de alerta:
                console.log("Verificación después de agregar stock:", resultado.mensaje || "Sin mensaje");

                // Continuar normalmente
                return axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`);
            })
            .then(resMedicamentos => {
                const listaMedicamentos = resMedicamentos.data;
                const actualizado = listaMedicamentos.find(med => med.medicamento.idMedicamento === parseInt(idMedicamento));
                if (!actualizado) return;

                const cantidadCell = document.getElementById(`cantidad-${idMedicamento}`);
                cantidadCell.textContent = actualizado.cantidadDisponible;
                input.value = "1";

                setTimeout(() => {
                    location.reload();
                }, 1500);
            })
            .catch(error => {
                if (error.response && error.response.status === 304) {
                    mostrarMensaje(idMedicamento, "Ya hay suficiente stock, no es necesario agregar más.", "error");
                } else {
                    mostrarMensaje(idMedicamento, "Error al agregar stock.", "error");
                    console.error(error);
                }
            });
    };

    function mostrarMensaje(idMedicamento, mensaje, tipo) {
        const fila = document.getElementById(`fila-${idMedicamento}`);
        if (!fila) return;

        const trSiguiente = fila.nextSibling;
        if (trSiguiente && (trSiguiente.classList && (trSiguiente.classList.contains("mensaje-exito") || trSiguiente.classList.contains("mensaje-error")))) {
            trSiguiente.remove();
        }

        const filaMensaje = document.createElement("tr");
        filaMensaje.classList.add(tipo === "exito" ? "mensaje-exito" : "mensaje-error");
        filaMensaje.innerHTML = `<td colspan="3" style="text-align:center; font-weight:bold; color: ${tipo === "exito" ? "green" : "orange"};">
            ${mensaje}
        </td>`;

        fila.parentNode.insertBefore(filaMensaje, fila.nextSibling);

        if (tipo === "error") {
            setTimeout(() => {
                filaMensaje.remove();
            }, 5000);
        }
    }

    function eliminarAlertaDeLocalStorage(idMedicamento) {
        const alertas = JSON.parse(localStorage.getItem("alertasBajoStock") || "[]");
        const nuevasAlertas = alertas.filter(a => a.idMedicamento !== parseInt(idMedicamento));
        localStorage.setItem("alertasBajoStock", JSON.stringify(nuevasAlertas));
        console.log(`🗑️ Alerta eliminada de localStorage para medicamento ID: ${idMedicamento}`);
    }
});
