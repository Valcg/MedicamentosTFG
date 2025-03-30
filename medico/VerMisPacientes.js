const baseURL = "http://localhost:9050/medicos";
const pacientesContainer = document.getElementById("pacientes");

// Función para ver los pacientes de un médico
function verMisPacientes() {
    const numeroColegiado = prompt("Ingrese su número de colegiado:");
    if (!numeroColegiado) {
        pacientesContainer.innerHTML = "<p>No se ingresó un número de colegiado.</p>";
        return;
    }
//--- REVISAR
    axios.get(`${baseURL}/VerMisPacientes/${numeroColegiado}`)
        .then(response => {
            if (response.data.length === 0) {
                pacientesContainer.innerHTML = "<p>No hay pacientes asociados.</p>";
                return;
            }

            let table = `<table border='1'><tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th></tr>`;
            response.data.forEach(paciente => {
                table += `<tr>
                    <td>${paciente.nombre}</td>
                    <td>${paciente.apellido}</td>
                    <td>${paciente.correo}</td>
                </tr>`;
            });
            table += `</table>`;
            pacientesContainer.innerHTML = table;
        })
        .catch(error => {
            pacientesContainer.innerHTML = "<p>Error al obtener los pacientes.</p>";
            console.error(error);
        });
}
