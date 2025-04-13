// VerRecetasPaciente.js
const recetasContainer = document.getElementById("historial-pacientes"); // Reutilizamos el mismo contenedor

function verRecetasDePaciente(idPaciente, nombrePaciente) {
    const numeroColegiado = localStorage.getItem("idUsuario");
    if (!numeroColegiado) {
        recetasContainer.innerHTML = "<p>Error: no se encontró el número de colegiado.</p>";
        return;
    }

    recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3><p>Cargando...</p>`;

    axios.get(`http://localhost:9050/medicos/VerRecetasDeMisPacientes/paciente/${idPaciente}/medico/${numeroColegiado}`)
        .then(response => {
            const recetas = response.data;

            if (!recetas || recetas.length === 0) {
                recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3><p>No hay recetas disponibles.</p>`;
                return;
            }

            let tabla = `<table border="1">
                <thead>
                    <tr>
                        <th>Fecha de Inicio</th>
                        <th>Medicamento</th>
                        <th>Dosis(cantidad ml o mg)</th>
                        <th>Frecuencia (h)</th>
                        <th>Duración (días)</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>`;

            recetas.forEach(receta => {
                const fecha = new Date(receta.fechaInicio).toLocaleString();
                const medicamento = receta.medicamento?.nombreMedicamento || "Sin medicamento";
                const dosis = receta.dosis ?? "No especificada";
                const frecuencia = receta.frecuencia ?? "No especificada";
                const duracion = receta.duracionTratamiento ?? "No especificada";
                const estado = receta.caducidad ?? "Desconocido";

                tabla += `
                    <tr>
                        <td>${fecha}</td>
                        <td>${medicamento}</td>
                        <td>${dosis}</td>
                        <td>${frecuencia}</td>
                        <td>${duracion}</td>
                        <td>${estado}</td>
                    </tr>`;
            });

            tabla += `</tbody></table>`;
            recetasContainer.innerHTML = `<h3>Recetas de ${nombrePaciente}</h3>${tabla}`;
        })
        .catch(error => {
            recetasContainer.innerHTML = "<p>Error al cargar las recetas.</p>";
            console.error(error);
        });
}
