document.addEventListener("DOMContentLoaded", function () {
    const resultadoDiv = document.getElementById("medicoseccioncrearreceta");

    // OBTENEMOS EL numeroColegiado DESDE localStorage
    const numeroColegiado = localStorage.getItem("idUsuario");

    if (!numeroColegiado) {
        resultadoDiv.innerHTML = "<p>Error: No se encontró el número de colegiado en localStorage.</p>";
        return;
    }

    // Cargamos medicamentos
    axios.get("http://localhost:9050/medicos/BuscarTodosLosMedicamentos")
        .then(response => {
            const medicamentos = response.data;
            let opcionesMedicamentos = medicamentos.map(med =>
                `<option value="${med.idMedicamento}">${med.nombreMedicamento}</option>`
            ).join("");

            resultadoDiv.innerHTML = `
                <label>Correo del Paciente</label>
                <input type="text" id="correo_paciente" class="input" autocomplete="off">
                
                <span id="mensajeCorreo" style="margin-top: 10px;"></span>
                <div id="sugerenciasCorreo" style="color:#00669C;"></div>
                <br>
                <input type="hidden" id="numero_colegiado" value="${numeroColegiado}" readonly>

                <label>Medicamento</label>
                <select id="id_medicamento" class="input">${opcionesMedicamentos}</select><br>

                <label>Dosis Por cada Toma</label>
                <input type="text" id="dosis" class="input"><br>

                <label>Frecuencia (cada cuántas horas)</label>
                <input type="text" id="frecuencia" class="input"><br>

                <label>Duración del Tratamiento (días)</label>
                <input type="text" id="duracion_tratamiento" class="input"><br>

                <label>Estado de la Receta:</label>
                <input type="text" id="caducidad paciente-text" style="color:#84CBF1; font-weight:bold;" value="Activa" readonly class="input pacientetext"><br>

                <button id="btnCrearReceta">Aceptar</button>
                <p id="mensajeReceta"></p>
            `;

            let pacientesAsociadosCorreos = [];

            // Traemos lista de pacientes asociados para sugerencias
            axios.get(`http://localhost:9050/medicos/VerMisPacientes/${numeroColegiado}`)
                .then(resp => {
                    pacientesAsociadosCorreos = resp.data.map(p => p.usuario.correo);
                });

            const correoInput = document.getElementById("correo_paciente");
            const mensajeCorreo = document.getElementById("mensajeCorreo");
            const sugerenciasDiv = document.getElementById("sugerenciasCorreo");

            correoInput.addEventListener("input", () => {
                const valor = correoInput.value.trim();
                mensajeCorreo.textContent = "";
                mensajeCorreo.dataset.valido = "false";
                sugerenciasDiv.innerHTML = "";

                const atIndex = valor.indexOf("@");

                if (atIndex === -1) {
                    // Usuario está escribiendo la parte antes del @
                    const nombreCorreo = valor.toLowerCase();

                    // Buscar correos que empiecen con lo escrito en la parte antes del @
                    const sugerencias = pacientesAsociadosCorreos.filter(correo => {
                        const nombrePaciente = correo.split("@")[0].toLowerCase();
                       return nombrePaciente.includes(nombreCorreo);

                    });

                    if (sugerencias.length > 0) {
                        mensajeCorreo.style.color = "#84CBF1";
                        mensajeCorreo.textContent = "Sugerencias de correos:";
                        sugerenciasDiv.innerHTML = sugerencias.map(correo => 
                            `<div style="cursor:pointer; background:#eee; padding:5px; margin:2px; border-radius:5px;" onclick="seleccionarCorreoSugerido('${correo}')">${correo}</div>`
                        ).join("");
                    } else {
                        mensajeCorreo.style.color = "#f14343";
                        mensajeCorreo.textContent = "No se encontraron sugerencias.";
                    }
                } else {
                    // Ya escribió el @, validar el correo completo
                    sugerenciasDiv.innerHTML = "";
                    const correoCompleto = valor.toLowerCase();

                    const exactMatch = pacientesAsociadosCorreos.find(c => c.toLowerCase() === correoCompleto);

                    if (exactMatch) {
                        correoInput.value = exactMatch; // autocompletar con mayúsculas originales
                        validarCorreoPaciente(exactMatch);
                    } else {
                        mensajeCorreo.style.color = "#f14343";
                        mensajeCorreo.textContent = "Correo no encontrado.";
                    }
                }
            });

            // Evento para enviar receta
            document.getElementById("btnCrearReceta").addEventListener("click", enviarReceta);
        })
        .catch(error => {
            console.error("Error al cargar medicamentos:", error);
            resultadoDiv.innerHTML = `<p style="color:red;">Error al cargar medicamentos: ${error.message}</p>`;
        });

    window.seleccionarCorreoSugerido = function(correo) {
        const correoInput = document.getElementById("correo_paciente");
        correoInput.value = correo;
        document.getElementById("sugerenciasCorreo").innerHTML = "";
        validarCorreoPaciente(correo);
    }

    function validarCorreoPaciente(correo) {
        const mensajeCorreo = document.getElementById("mensajeCorreo");

        axios.get(`http://localhost:9050/medicos/buscarPorCorreo?correo=${correo}`)
            .then(response => {
                const paciente = response.data;
                if (paciente) {
                    axios.get(`http://localhost:9050/medicos/VerMisPacientes/${numeroColegiado}`)
                        .then(pacientesAsociadosResponse => {
                            const pacientesAsociados = pacientesAsociadosResponse.data;
                            const pacienteAsociado = pacientesAsociados.find(p => p.usuario.correo.toLowerCase() === correo.toLowerCase());

                            if (pacienteAsociado) {
                                mensajeCorreo.style.color = "#66b794f1";
                                mensajeCorreo.textContent = "Es una cuenta Paciente y está asociada al médico";
                                mensajeCorreo.dataset.valido = "true";
                            } else {
                                mensajeCorreo.style.color = "#f14343";
                                mensajeCorreo.textContent = "Correo no asociado a este médico";
                                mensajeCorreo.dataset.valido = "false";
                            }
                        })
                        .catch(() => {
                            mensajeCorreo.style.color = "#f14343";
                            mensajeCorreo.textContent = "Error al verificar la asociación con el médico";
                            mensajeCorreo.dataset.valido = "false";
                        });
                } else {
                    mensajeCorreo.style.color = "#f14343";
                    mensajeCorreo.textContent = "Correo no asociado a un paciente";
                    mensajeCorreo.dataset.valido = "false";
                }
            })
            .catch(() => {
                mensajeCorreo.style.color = "#f14343";
                mensajeCorreo.textContent = "Error al verificar el correo. No existe como Paciente";
                mensajeCorreo.dataset.valido = "false";
            });
    }

    function enviarReceta() {
        const mensajeCorreo = document.getElementById("mensajeCorreo");

        if (mensajeCorreo.dataset.valido !== "true") {
            document.getElementById("mensajeReceta").innerHTML = `<span style="color:#f14343;">No se puede crear la receta. El correo no está asociado</span>`;
            return;
        }

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
                    caducidad: "Activa"
                };

                axios.post("http://localhost:9050/medicos/CrearReceta", recetaDto)
                    .then(() => {
                        document.getElementById("mensajeReceta").innerHTML = `<span style="color: #66b794f1;">Receta creada correctamente</span>`;
                    })
                    .catch(() => {
                        document.getElementById("mensajeReceta").innerHTML = `
                            <span style="color:#00669C;">Ya existe una receta para este medicamento.<br> Para crear una nueva receta, debes caducar la receta que está dada de alta</span>
                            <br>
                            <button id="btnRedirigir" style="background-color:#f14343; cursor: pointer; margin-top:20px;" onclick="window.location.href = '/cliente_medico/seccionpacientes.html';
;">Ir a Ver Mis Pacientes</button>`;
                    });
            })
            .catch(() => {
                document.getElementById("mensajeReceta").innerHTML = `<span style="color:red;">Paciente no encontrado</span>`;
            });
    }
});
