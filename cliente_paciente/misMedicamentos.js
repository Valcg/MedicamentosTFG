document.addEventListener("DOMContentLoaded", function () {
    const idPaciente = localStorage.getItem("idUsuario");
    if (!idPaciente) {
        console.error("Error: No se encontró el ID del paciente en localStorage.");
        return;
    }

    const contenedor = document.getElementById("pacienteMisMedicamentos");

    function cargarMisMedicamentos() {
        const url = `http://medicade-back.involux.es/pacientes/VerMisMedicamentos/paciente/${idPaciente}`;

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
                                <td>Acciones</td>
                            </tr>
                `;

                medicamentos.forEach(item => {
                    html += `
                        <tr class="tablahover">
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
            })
            .catch(error => {
                contenedor.innerHTML = "<p>Error al cargar tus medicamentos.</p>";
                console.error("Error al obtener medicamentos del paciente:", error);
            });
    }

    // Llama a la función al cargar
    cargarMisMedicamentos();

    // Función global para agregar stock
    window.agregarStock = function (idPaciente, idMedicamento) {
        const input = document.getElementById(`input-${idMedicamento}`);
        const cantidadCajas = parseInt(input.value);

        if (isNaN(cantidadCajas) || cantidadCajas <= 0) {
            alert("Ingresa una cantidad válida.");
            return;
        }

        const url = `http://medicade-back.involux.es/pacientes/${idPaciente}/medicamentos/${idMedicamento}/agregar-stock?cantidadCajas=${cantidadCajas}`;

        axios.post(url)
            .then(response => {
                alert(response.data);

                return axios.get(`http://medicade-back.involux.es/pacientes/vermedicamentos/paciente/${idPaciente}`);
            })
            .then(res => {
                const listaMedicamentos = res.data;
                const actualizado = listaMedicamentos.find(med => med.medicamento.idMedicamento === parseInt(idMedicamento));
                if (!actualizado) return;

                const cantidadCell = document.getElementById(`cantidad-${idMedicamento}`);
                cantidadCell.textContent = actualizado.cantidadDisponible;
                input.value = "1";
            })
            .catch(error => {
                if (error.response && error.response.status === 304) {
                    alert("Ya hay suficiente stock, no es necesario agregar más.");
                } else {
                    alert("Error al agregar stock.");
                    console.error(error);
                }
            });
    };
});
