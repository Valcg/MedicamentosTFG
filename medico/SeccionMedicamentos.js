// -------------------------------------
// SECCIÓN: Alta de Medicamentos
// -------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const mensajeAlta = document.getElementById("mensajeAlta");

    document.getElementById("btnAltaMedicamento").addEventListener("click", function () {
        const nombreMedicamento = document.getElementById("nombreMedicamento").value.trim();
        const cantidadUnidad = document.getElementById("cantidadUnidad").value;

        if (!nombreMedicamento) {
            mensajeAlta.innerHTML = "<p style='color: red;'>El nombre del medicamento no puede estar vacío.</p>";
            return;
        }

        if (!cantidadUnidad || isNaN(cantidadUnidad) || cantidadUnidad <= 0) {
            mensajeAlta.innerHTML = "<p style='color: red;'>Por favor, ingrese una cantidad válida mayor a 0.</p>";
            return;
        }

        const medicamento = {
            nombreMedicamento: nombreMedicamento,
            cantidadUnidad: parseInt(cantidadUnidad)
        };

        axios.post("http://localhost:9050/medicos/AltaMedicamentos", medicamento)
            .then(response => {
                mensajeAlta.innerHTML = `<p style="color: green;">Medicamento creado: ${response.data.nombreMedicamento}</p>`;
            })
            .catch(error => {
                mensajeAlta.innerHTML = "<p style='color: red;'>Error al crear el medicamento. Por favor, intente nuevamente.</p>";
                console.error(error);
            });
    });
});

// -------------------------------------
// SECCIÓN: Búsqueda y Listado de Medicamentos
// -------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const inputNombre = document.getElementById("nombreMedicamento");
    const btnBuscar = document.getElementById("btnBuscarMedicamento");
    const resultadoBusqueda = document.getElementById("resultadoBusqueda");
    const tablaBody = document.querySelector("#tablaMedicamentos tbody");

    btnBuscar.addEventListener("click", function () {
        const nombre = inputNombre.value.trim();

        if (!nombre) {
            resultadoBusqueda.innerHTML = "<p>Por favor, ingresa un nombre para buscar.</p>";
            return;
        }

        axios.get(`http://localhost:9050/medicos/BuscarUnMedicamentoPorNombre/${nombre}`)
            .then(response => {
                const medicamentos = response.data;

                if (medicamentos.length > 0) {
                    let html = "<ul>";
                    medicamentos.forEach(med => {
                        html += `<li><strong>${med.nombreMedicamento}</strong> - ${med.cantidadUnidad} unidades</li>`;
                    });
                    html += "</ul>";
                    resultadoBusqueda.innerHTML = html;
                } else {
                    resultadoBusqueda.innerHTML = "<p>No se encontraron medicamentos con ese nombre.</p>";
                }
            })
            .catch(error => {
                resultadoBusqueda.innerHTML = "<p>Error al buscar medicamentos.</p>";
                console.error(error);
            });
    });

    function cargarTodosLosMedicamentos() {
        axios.get("http://localhost:9050/medicos/BuscarTodosLosMedicamentos")
            .then(response => {
                const medicamentos = response.data;
                tablaBody.innerHTML = "";

                medicamentos.forEach(med => {
                    const row = `
                        <tr>
                            <td>${med.nombreMedicamento}</td>
                            <td>${med.cantidadUnidad}</td>
                        </tr>
                    `;
                    tablaBody.innerHTML += row;
                });
            })
            .catch(error => {
                tablaBody.innerHTML = "<tr><td colspan='2'>Error al cargar medicamentos.</td></tr>";
                console.error(error);
            });
    }

    cargarTodosLosMedicamentos();
});
