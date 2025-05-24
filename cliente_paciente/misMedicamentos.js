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
                        fila.style.backgroundColor = "#fff3b0"; // Amarillo suave
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

        const url = `http://localhost:9050/pacientes/${idPaciente}/medicamentos/${idMedicamento}/agregar-stock?cantidadCajas=${cantidadCajas}`;

        axios.post(url)
            .then(response => {
                mostrarMensaje(idMedicamento, "Stock agregado correctamente.", "exito");
                localStorage.setItem("medicamentoResaltado", idMedicamento);

                // Actualizar cantidad sin esperar la recarga aún
                return axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`);
            })
            .then(res => {
                const listaMedicamentos = res.data;
                const actualizado = listaMedicamentos.find(med => med.medicamento.idMedicamento === parseInt(idMedicamento));
                if (!actualizado) return;

                const cantidadCell = document.getElementById(`cantidad-${idMedicamento}`);
                cantidadCell.textContent = actualizado.cantidadDisponible;
                input.value = "1";

                // Recargar para mostrar el resaltado
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

        // Quitar mensajes previos si existen justo después de esta fila
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
});
