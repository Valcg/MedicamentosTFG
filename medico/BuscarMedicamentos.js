document.addEventListener("DOMContentLoaded", function () {
    const inputNombre = document.getElementById("nombreMedicamento");
    const btnBuscar = document.getElementById("btnBuscarMedicamento");
    const resultadoBusqueda = document.getElementById("resultadoBusqueda");
    const tablaBody = document.querySelector("#tablaMedicamentos tbody");

    // Función para buscar medicamentos por nombre
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

    // Función para mostrar todos los medicamentos en la tabla
    function cargarTodosLosMedicamentos() {
        axios.get("http://localhost:9050/medicos/BuscarTodosLosMedicamentos")
            .then(response => {
                const medicamentos = response.data;
                tablaBody.innerHTML = ""; // Limpiar tabla

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

    // Al cargar la página, mostrar todos los medicamentos
    cargarTodosLosMedicamentos();
});
