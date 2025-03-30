// crearReceta.js
function crearReceta() {
    resultadoDiv.innerHTML = `
        <div id="crearRecetaDiv">
            <h3>Crear Receta</h3>
            <label>ID Paciente:</label><input type="text" id="id_paciente"><br>
            <label>Número Colegiado:</label><input type="text" id="numero_colegiado"><br>
            <label>ID Medicamento:</label><input type="text" id="id_medicamento"><br>
            <label>Dosis:</label><input type="text" id="dosis"><br>
            <label>Frecuencia (veces al día):</label><input type="text" id="frecuencia"><br>
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
}

function enviarReceta() {
    const receta = {
        id_paciente: document.getElementById("id_paciente").value,
        numero_colegiado: document.getElementById("numero_colegiado").value,
        id_medicamento: document.getElementById("id_medicamento").value,
        dosis: document.getElementById("dosis").value,
        frecuencia: document.getElementById("frecuencia").value,
        duracion_tratamiento: document.getElementById("duracion_tratamiento").value,
        caducidad: document.getElementById("caducidad").value
    };

    axios.post("http://localhost:9050/medicos/CrearReceta", receta)
        .then(response => {
            document.getElementById("mensajeReceta").innerHTML = `<p style="color: green;">Éxito: ${response.data}</p>`;
        })
        .catch(error => {
            document.getElementById("mensajeReceta").innerHTML = `<p style="color: red;">Error al crear la receta.</p>`;
            console.error(error);
        });
}
