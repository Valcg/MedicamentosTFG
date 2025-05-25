document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "http://localhost:9050/medicos";
    const pacientesContainer = document.getElementById("medicoseccionpacientes");

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

                let table = `<table class="tablapaciente">
                    <tr>
                        <th colspan="6"><h2>Mis Pacientes</h2></th>
                    </tr>
                    <tr>
                        <td>Nombre</td>
                        <td>Apellido</td>
                        <td>Correo</td>
                        <td></td> <!-- Columna para Ver Historial -->
                        <td></td> <!-- Columna para Ver Recetas -->
                        <td></td> <!-- Columna para Ver Contactos -->
                    </tr>`;

                response.data.forEach(paciente => {
                    table += `
                    <tr class="tablahover">
                        <td style="font-weight: bold;">${paciente.usuario.nombre}</td>
                        <td>${paciente.usuario.apellido}</td>
                        <td>${paciente.usuario.correo}</td>
                        <td>
                            <button class="btnVerHistorial hover" data-id="${paciente.idPaciente}" data-nombre="${paciente.usuario.nombre}">
                                Ver Historial
                            </button>
                        </td>
                        <td>
                            <button class="btnVerRecetas hover" data-id="${paciente.idPaciente}" data-nombre="${paciente.usuario.nombre}">
                                Ver Recetas
                            </button>
                        </td>
<td>
  <button class="btnVerContactos hover" data-correo="${paciente.usuario.correo}">
    Ver Contactos
  </button>
</td>

                    </tr>`;
                });

                table += `</table>`;
                pacientesContainer.innerHTML = table;

                // ------------ EVENT LISTENER BOTÓN "Ver Historial" ------------
                document.querySelectorAll(".btnVerHistorial").forEach(button => {
                    button.addEventListener("click", function () {
                        const idPaciente = this.getAttribute("data-id");
                        const nombrePaciente = this.getAttribute("data-nombre");
                        localStorage.setItem("idPacienteSeleccionado", idPaciente);
                        localStorage.setItem("nombrePacienteSeleccionado", nombrePaciente);
                        localStorage.setItem("tipoVista", "historial");
                        window.location.href = "seccionpacientesverlistas.html";
                    });
                });

                // ------------ EVENT LISTENER BOTÓN "Ver Recetas" ------------
                document.querySelectorAll(".btnVerRecetas").forEach(button => {
                    button.addEventListener("click", function () {
                        const idPaciente = this.getAttribute("data-id");
                        const nombrePaciente = this.getAttribute("data-nombre");
                        localStorage.setItem("idPacienteSeleccionado", idPaciente);
                        localStorage.setItem("nombrePacienteSeleccionado", nombrePaciente);
                        localStorage.setItem("tipoVista", "recetas");
                        window.location.href = "seccionpacientesverlistas.html";
                    });
                });

                    document.querySelectorAll(".btnVerContactos").forEach(button => {
                    button.addEventListener("click", function () {
                    const correoPaciente = this.getAttribute("data-correo");
                    localStorage.setItem("correo", correoPaciente);
                    window.location.href = "./verContactosMedico.html";

                    });
                });
            })
            .catch(error => {
                pacientesContainer.innerHTML = "<p>Error al obtener los pacientes.</p>";
                console.error(error);
            });
    }

    verMisPacientes();
});
