document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "http://localhost:9050/medicos";
    const pacientesContainer = document.getElementById("pacientes");
    const historialContainer = document.getElementById("historial-pacientes"); // Asegúrate de tener este div

    // Función para obtener pacientes
    function verMisPacientes() {
        const numeroColegiado = localStorage.getItem("idUsuario");

        if (!numeroColegiado) {
            pacientesContainer.innerHTML = "<p>No se encontró el número de colegiado. Asegúrate de iniciar sesión.</p>";
            return;
        }

        axios.get(`${baseURL}/VerMisPacientes/${numeroColegiado}`)
        
        

            .then(response => {
                if (response.data.length === 0) {
                    
                    pacientesContainer.innerHTML = "<p>No hay pacientes asociados.</p>";
                    return;
                }
                console.log("daTA DEL PACIETNE:", response.data);


                let table = `<table border='1'>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>ID</th> <!-- Nueva columna para el ID -->
                        <th>Historial</th>
                    </tr>`;

                response.data.forEach(paciente => {
                    table += `
                    <tr>
                        <td>${paciente.usuario.nombre}</td>
                        <td>${paciente.usuario.apellido}</td>
                        <td>${paciente.usuario.correo}</td>
                        <td style="background-color: #D3D3D3;">${paciente.idPaciente}</td> <!-- Celda con ID en gris -->
                        <td>
                            <button class="verHistorial" data-id="${paciente.idPaciente}" data-nombre="${paciente.usuario.nombre}">
                                Ver Historial
                            </button>
                        </td>
                    </tr>`;
                });

                table += `</table>`;
                pacientesContainer.innerHTML = table;

                // Event listener para los botones "Ver Historial"
                document.querySelectorAll(".verHistorial").forEach(button => {
                    button.addEventListener("click", function () {
                        const idPaciente = this.getAttribute("data-id");
                        const nombrePaciente = this.getAttribute("data-nombre");
                        mostrarHistorialDePaciente(idPaciente, nombrePaciente);
                    });
                });
            })
            .catch(error => {
                pacientesContainer.innerHTML = "<p>Error al obtener los pacientes.</p>";
                console.error(error);
            });
    }

    // Función para mostrar el historial de un paciente
    function mostrarHistorialDePaciente(idPaciente, nombrePaciente) {
        historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3><p>Cargando...</p>`;

        axios.get(`${baseURL}/VerHistorialDeMisPacientes/${idPaciente}`)
            .then(response => {
                const historial = response.data;
                console.log("Historial recibido:", response.data);


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

                    let estadoHTML = estado === "confirmado"
                        ? `<td style="color: green;">${estado}</td>`
                        : `<td>${estado}</td>`;

                    tabla += `
                        <tr>
                            <td>${fechaFormateada} ${horaFormateada}</td>
                            ${estadoHTML}
                            <td>${medicamento}</td>
                        </tr>
                    `;
                });

                tabla += `</tbody></table>`;
                historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3>${tabla}`;
            })
            .catch(error => {
                historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
                console.error(error);
            });
    }

    verMisPacientes();
});
