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

    // Obtener el idPaciente desde localStorage
    const idPaciente = localStorage.getItem("idUsuario"); 

    if (!idPaciente) {
        historialContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // Construir la URL con el idPaciente
    const url = `http://localhost:9050/pacientes/Vermihistorial/${idPaciente}`;

    axios.get(url)
        .then(res => {
            const historial = res.data;

            if (!historial || historial.length === 0) {
                historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
            } else {
                historial.forEach(toma => {
                    const fila = document.createElement("tr");

                    // Formatear fecha y hora a "DD/MM/YYYY HH:MM"
                    const fechaHora = new Date(toma.fechaHoraToma);
                    const dia = fechaHora.getDate().toString().padStart(2, '0'); // DD
                    const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0'); // MM
                    const anio = fechaHora.getFullYear(); // YYYY
                    const hora = fechaHora.getHours().toString().padStart(2, '0'); // HH
                    const minutos = fechaHora.getMinutes().toString().padStart(2, '0'); // MM
                    const fechaHoraFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`;

                    // Verificar que los datos existen antes de acceder a ellos
                    const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                    const nombreMedicamento = toma.alerta && toma.alerta.medicamento ? toma.alerta.medicamento.nombreMedicamento : 'No disponible';

                    fila.innerHTML = `
                        <td>${fechaHoraFormateada}</td>
                        <td>${estadoAlerta}</td>
                        <td>${nombreMedicamento}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });
            }

            historialContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
        });
});
