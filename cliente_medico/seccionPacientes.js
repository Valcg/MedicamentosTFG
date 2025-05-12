// seccionpacientes.js
document.addEventListener("DOMContentLoaded", function () {
    const baseURL = "http://localhost:9050/medicos";
    const pacientesContainer = document.getElementById("medicoseccionpacientes");

    function verMisPacientes() {
        const numeroColegiado = localStorage.getItem("idUsuario");

        if (!numeroColegiado) {
            pacientesContainer.innerHTML = "<p>No se encontró el número de colegiado. Asegúrate de iniciar sesión.</p>";
            return;
        }
        //  ---------- PARA VER ID si hace falta          <td>ID</th> ------------------    <td style="background-color:yellow;">${paciente.idPaciente}</td>
        axios.get(`${baseURL}/VerMisPacientes/${numeroColegiado}`)
            .then(response => {
                if (response.data.length === 0) {
                    pacientesContainer.innerHTML = "<p>No hay pacientes asociados.</p>";
                    return;
                }

                let table = `<table class="tablapaciente">
                <tr>
                        <th colspan="6">   <h2>Mis Pacientes</h2></th>
                </tr>
                
                <tr>
                        <td>Nombre</th>
                        <td>Apellido</th>
                        <td>Correo</th>
                        <td>Historial</th>
                        <td>Recetas</th>
                </tr>`;

                response.data.forEach(paciente => {
                    table += `
                <tr class="tablahover">
                        <td style="    font-weight: bold;">${paciente.usuario.nombre}</td>
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
                </tr>`;
                });

                table += `</table>`;
                pacientesContainer.innerHTML = table;

                // Redirigir a seccionpacientesverlistas.html con datos en localStorage
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
            })
            .catch(error => {
                pacientesContainer.innerHTML = "<p>Error al obtener los pacientes.</p>";
                console.error(error);
            });
    }

    verMisPacientes();
});
