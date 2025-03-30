// BuscarMedicamentos.js
document.addEventListener("DOMContentLoaded", function () {
    const mensajeBusqueda = document.getElementById("mensajeBusqueda");

    document.getElementById("btnBuscarMedicamento").addEventListener("click", function () {
        const nombreMedicamento = document.getElementById("nombreMedicamento").value;

        axios.get(`http://localhost:9050/medicos/BuscarUnMedicamentoPorNombre/${nombreMedicamento}`)
            .then(response => {
                const medicamentos = response.data;

                if (medicamentos.length > 0) {
                    let listado = "<ul>";
                    medicamentos.forEach(medicamento => {
                        listado += `<li>${medicamento.nombre}: ${medicamento.descripcion}</li>`;
                    });
                    listado += "</ul>";
                    mensajeBusqueda.innerHTML = listado;
                } else {
                    mensajeBusqueda.innerHTML = "<p>No se encontraron medicamentos.</p>";
                }
            })
            .catch(error => {
                mensajeBusqueda.innerHTML = "<p>Error al buscar medicamentos.</p>";
                console.error(error);
            });
    });
});
