// VerHistorialDeToma.js
document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("historial-container");

    const idPaciente = localStorage.getItem("idPaciente");
    if (!idPaciente) {
        historialContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `http://localhost:9050/medicos/VerHistorialDeMisPacientes/${idPaciente}`;

    axios.get(url)
        .then(response => {
            const historial = response.data;

            if (historial.length === 0) {
                historialContainer.innerHTML = "<p>No hay historial de tomas.</p>";
            } else {
                const tabla = document.createElement("table");
                tabla.innerHTML = `
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Medicamento</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                const cuerpoTabla = tabla.querySelector("tbody");

                historial.forEach(toma => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${new Date(toma.fecha).toLocaleDateString()}</td>
                        <td>${toma.medicamento.nombre}</td>
                        <td>${toma.estado}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });

                historialContainer.appendChild(tabla);
            }
        })
        .catch(err => {
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            console.error(err);
        });
});
