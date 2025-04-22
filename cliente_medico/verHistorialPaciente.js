// VerHistorialPaciente.js
const baseURL = "http://localhost:9050/medicos";
const historialContainer = document.getElementById("historial-pacientes");

function mostrarHistorialDePaciente(idPaciente, nombrePaciente) {
    historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3><p>Cargando...</p>`;

    axios.get(`${baseURL}/VerHistorialDeMisPacientes/${idPaciente}`)
        .then(response => {
            const historial = response.data;

            if (!historial || historial.length === 0) {
                historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3><p>No hay historial de tomas disponible.</p>`;
                return;
            }

            historial.sort((a, b) => new Date(b.fechaHoraToma) - new Date(a.fechaHoraToma));

            let tabla = `<table border="1">
                <thead>
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Estado</th>
                        <th>Medicamento</th>
                    </tr>
                </thead>
                <tbody>`;

            historial.forEach(toma => {
                const fechaHora = new Date(toma.fechaHoraToma);
                const fechaFormateada = fechaHora.toLocaleDateString();
                const horaFormateada = fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const estado = toma.alerta?.estadoAlerta || "Sin estado";
                const medicamento = toma.alerta?.medicamento?.nombreMedicamento || "Sin medicamento";

                const estadoHTML = estado === "confirmado"
                    ? `<td style="color: green;">${estado}</td>`
                    : `<td>${estado}</td>`;

                tabla += `
                    <tr>
                        <td>${fechaFormateada} ${horaFormateada}</td>
                        ${estadoHTML}
                        <td>${medicamento}</td>
                    </tr>`;
            });

            tabla += `</tbody></table>`;
            historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3>${tabla}`;
        })
        .catch(error => {
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            console.error(error);
        });
}
