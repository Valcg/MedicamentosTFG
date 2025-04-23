document.addEventListener("DOMContentLoaded", function () {
    const tablaBody = document.querySelector("#tablaMedicamentosPaciente tbody");
    const idPaciente = 1; // <- Reemplazá esto por el ID real del paciente

    function cargarMisMedicamentos() {
        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const medicamentos = response.data;
                tablaBody.innerHTML = "";

                if (!medicamentos || medicamentos.length === 0) {
                    tablaBody.innerHTML = "<tr><td colspan='2'>No tienes medicamentos registrados.</td></tr>";
                    return;
                }

                medicamentos.forEach(item => {
                    const row = `
                        <tr>
                            <td>${medicamento.nombreMedicamento}</td>
                            <td>${item.cantidadDisponible}</td>
                        </tr>
                    `;
                    tablaBody.innerHTML += row;
                });
            })
            .catch(error => {
                tablaBody.innerHTML = "<tr><td colspan='2'>Error al cargar tus medicamentos.</td></tr>";
                console.error("Error al obtener medicamentos del paciente:", error);
            });
    }

    cargarMisMedicamentos();
});
