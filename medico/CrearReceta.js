document.addEventListener("DOMContentLoaded", function () {
    crearFormularioReceta();
});

axios.get("http://localhost:9050/medicos/BuscarTodosLosMedicamentos")
    .then(response => {
        // Asegúrate de que response.data contiene el array de medicamentos
        console.log(response); // Imprime toda la respuesta para verificar la estructura
        const medicamentos = response.data;  // Esto debe ser el array de objetos con los medicamentos
        let opcionesMedicamentos = medicamentos.map(med => 
            `<option value="${med.idMedicamento}">${med.nombreMedicamento}</option>`
        ).join("");  // Usamos nombreMedicamento para mostrar el nombre del medicamento

        resultadoDiv.innerHTML = `
            <div id="crearRecetaDiv">
                <h3>Crear Receta</h3>
                <label>Correo del Paciente:</label><input type="text" id="correo_paciente"><br>
                <label>Número Colegiado:</label><input type="text" id="numero_colegiado"><br>
                <label>Medicamento:</label>
                <select id="id_medicamento">
                    ${opcionesMedicamentos}
                </select><br>
                <label>Dosis:</label><input type="text" id="dosis"><br>
                <label>Frecuencia (cada cuántas horas):</label><input type="text" id="frecuencia"><br>
                <label>Duración del Tratamiento (días):</label><input type="text" id="duracion_tratamiento"><br>
                <label>Estado de la Receta:</label>
                <select id="caducidad">
                    <option value="Activa">Activa</option>
                    <option value="Caducada">Caducada</option>
                </select><br>
                <button onclick="enviarReceta()">Aceptar</button>
                <p id="mensajeReceta"></p>
            </div>
        `;
    })
    .catch(error => {
        console.error("Error al cargar medicamentos:", error);
        resultadoDiv.innerHTML = `<p style="color:red;">Error al cargar medicamentos: ${error.message}</p>`;
    });

function enviarReceta() {
    const correoPaciente = document.getElementById("correo_paciente").value;

    axios.get(`http://localhost:9050/medicos/buscarPorCorreo?correo=${correoPaciente}`)
        .then(response => {
            const paciente = response.data;

            const recetaDto = {
                paciente: paciente,
                numeroColegiado: document.getElementById("numero_colegiado").value,
                medicamento: {
                    idMedicamento: document.getElementById("id_medicamento").value
                },
                dosis: document.getElementById("dosis").value,
                frecuencia: document.getElementById("frecuencia").value,
                duracionTratamiento: document.getElementById("duracion_tratamiento").value,
                caducidad: document.getElementById("caducidad").value
            };

            axios.post("http://localhost:9050/medicos/CrearReceta", recetaDto)
                .then(res => {
                    document.getElementById("mensajeReceta").innerHTML = `<span style="color:green;">Receta creada correctamente</span>`;
                })
                .catch(err => {
                    console.error("Error al crear receta:", err);
                    document.getElementById("mensajeReceta").innerHTML = `<span style="color:red;">Error al crear receta</span>`;
                });
        })
        .catch(error => {
            document.getElementById("mensajeReceta").innerHTML = `<span style="color:red;">Paciente no encontrado</span>`;
            console.error("Error al buscar paciente:", error);
        });
}
