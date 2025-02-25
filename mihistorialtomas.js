document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");

    // Crear la tabla
    const tabla = document.createElement("table");
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Fecha y Hora de Toma</th>
                <th>Estado de Alerta</th>
                <th>Nombre del Medicamento</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const cuerpoTabla = tabla.querySelector("tbody");

    axios.get("http://localhost:9050/pacientes/Vermihistorial/1")
        .then(res => {
            const historial = res.data;

            if (historial.length === 0) {
                historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
            } else {
                historial.forEach(toma => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${toma.fechaHoraToma}</td>
                        <td>${toma.alerta.estadoAlerta}</td>
                        <td>${toma.alerta.medicamento.nombreMedicamento}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });
            }

            historialContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
