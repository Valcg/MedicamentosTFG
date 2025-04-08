document.addEventListener("DOMContentLoaded", function () {
    const idPaciente = localStorage.getItem("idUsuario");
    const tablaContenedor = document.getElementById("tablaMisMedicamentos");
    const verMedicamentosBtn = document.getElementById("verMisMedicamentosBtn");

    if (!idPaciente) {
        tablaContenedor.innerHTML = "<p>Error: No se encontró el ID del paciente.</p>";
        return;
    }

    verMedicamentosBtn.addEventListener("click", cargarMedicamentos);
    
    function cargarMedicamentos() {
        axios.get(`http://localhost:9050/pacientes/recetasActivas/${idPaciente}`)
            .then(res => {
                const recetas = res.data;

                if (!recetas || recetas.length === 0) {
                    tablaContenedor.innerHTML = "<p>No tienes medicamentos activos.</p>";
                    return;
                }

                let tablaHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Medicamento</th>
                                <th>Stock Disponible</th>
                                <th>Agregar Stock</th>
                            </tr>
                        </thead>
                        <tbody id="cuerpoTablaMedicamentos"></tbody>
                    </table>
                `;

                tablaContenedor.innerHTML = tablaHTML;
                const cuerpoTabla = document.getElementById("cuerpoTablaMedicamentos");

                recetas.forEach(receta => {
                    const med = receta.medicamento;
                    const idMed = med.idMedicamento;

                    // Ver stock actual (cambio aquí 👇)
                    axios.get(`http://localhost:9050/pacientes/VerCantidadDeMisMedicamentos/pacientes/${idPaciente}/medicamentos/${idMed}`)
                        .then(stockRes => {
                            const stock = stockRes.data.cantidadDisponible || 0;

                            const fila = document.createElement("tr");
                            fila.innerHTML = `
                                <td>${med.nombreMedicamento}</td>
                                <td id="stock-${idMed}">${stock}</td>
                                <td>
                                    <input type="number" id="input-${idMed}" min="1" placeholder="Cantidad" style="width: 80px;">
                                    <button class="confirm-btn" onclick="agregarStock(${idPaciente}, ${idMed})">Agregar</button>
                                </td>
                            `;
                            cuerpoTabla.appendChild(fila);
                        })
                        .catch(err => {
                            console.error("Error obteniendo stock:", err);
                            const fila = document.createElement("tr");
                            fila.innerHTML = `
                                <td>${med.nombreMedicamento}</td>
                                <td colspan="2">Error al cargar stock</td>
                            `;
                            cuerpoTabla.appendChild(fila);
                        });
                });
            })
            .catch(err => {
                console.error("Error obteniendo medicamentos activos:", err);
                tablaContenedor.innerHTML = "<p>Error al cargar los medicamentos.</p>";
            });
    }
});

// Función global para agregar stock
function agregarStock(idPaciente, idMedicamento) {
    const input = document.getElementById(`input-${idMedicamento}`);
    const cantidad = parseInt(input.value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    axios.post(`http://localhost:9050/pacientes/${idPaciente}/medicamentos/${idMedicamento}/agregar-stock?cantidadCajas=${cantidad}`)
        .then(() => {
            alert("Stock actualizado correctamente.");

            // Refrescar stock (cambio aquí también 👇)
            return axios.get(`http://localhost:9050/pacientes/VerCantidadDeMisMedicamentos/pacientes/${idPaciente}/medicamentos/${idMedicamento}`);
        })
        .then(stockRes => {
            const nuevoStock = stockRes.data.cantidadDisponible;
            const stockCell = document.getElementById(`stock-${idMedicamento}`);
            if (stockCell) {
                stockCell.textContent = nuevoStock;
            }

            // Verificar stock bajo
            return axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`);
        })
        .then(verifyRes => {
            console.log("Verificación de stock:", verifyRes.data);
        })
        .catch(err => {
            console.error("Error en el proceso de agregar stock:", err);
            alert("Hubo un problema al actualizar el stock.");
        });
}
