document.addEventListener("DOMContentLoaded", function () {
    const alertasContainer = document.getElementById("mis-alertas-medicas");

    // ---------- INICIO TRANSFORMACIÓN DE FECHA ----------
    function obtenerFechaYHoraFormateada(fechaStr) {
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const fecha = new Date(fechaStr);
        const diaSemana = dias[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        const fechaTexto = `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes} de ${año}`;
        const horaTexto = `${hora}:${minutos}`;
        const claveAgrupacion = `${año}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

        return {
            fechaTexto,
            horaTexto,
            claveAgrupacion
        };
    }
    // ---------- FIN TRANSFORMACIÓN DE FECHA ----------

    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        alertasContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    const url = `https://medicade-back.involux.es/pacientes/VermisAlertas/${idPaciente}`;

    axios.get(url)
        .then(res => {
            let alertas = res.data;

            if (!alertas || alertas.length === 0) {
                alertasContainer.innerHTML = "<p>No hay alertas disponibles.</p>";
                return;
            }

            const ahora = new Date();
            alertas = alertas
                .map(alerta => ({
                    ...alerta,
                    fechaHoraDate: new Date(alerta.fechaHoraAlerta)
                }))
                .filter(alerta => alerta.fechaHoraDate >= ahora)
                .sort((a, b) => a.fechaHoraDate - b.fechaHoraDate);

            if (alertas.length === 0) {
                alertasContainer.innerHTML = "<p>No hay próximas alertas médicas.</p>";
                return;
            }

            const alertasAgrupadas = {};

            alertas.forEach(alerta => {
                const { fechaTexto, horaTexto, claveAgrupacion } = obtenerFechaYHoraFormateada(alerta.fechaHoraAlerta);
                if (!alertasAgrupadas[claveAgrupacion]) {
                    alertasAgrupadas[claveAgrupacion] = {
                        fechaTexto,
                        alertas: []
                    };
                }
                alertasAgrupadas[claveAgrupacion].alertas.push({
                    ...alerta,
                    horaTexto
                });
            });

            const tabla = document.createElement("table");
            tabla.id = "tablapacienteMisAlertas";
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <td>Fecha y Hora</td>
                        <td>Medicamento</td>
                        <td>Estado</td>
                        <td>Tipo de Alerta</td>
                        <td>Total Uds/Stk</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const cuerpoTabla = tabla.querySelector("tbody");

            for (const clave in alertasAgrupadas) {
                const grupo = alertasAgrupadas[clave];
                const filaTitulo = document.createElement("tr");
                filaTitulo.innerHTML = `<td colspan="6" style="background-color:#fafafa; padding: 10px;">${grupo.fechaTexto}</td>`;
                cuerpoTabla.appendChild(filaTitulo);

                grupo.alertas.forEach(alerta => {
                    const fila = document.createElement("tr");
                    fila.classList.add("tablahover");
                    const nombreMedicamento = alerta.medicamento ? alerta.medicamento.nombreMedicamento : 'No disponible';
                    const cantidadUnidad = alerta.medicamento ? alerta.medicamento.cantidadUnidad : 'No disponible';
                    const idMedicamento = alerta.medicamento ? alerta.medicamento.idMedicamento : null;

                    const estadoAlerta = alerta.estadoAlerta === 'sinConfirmar'
                        ? `<span class="estadoinact">Sin Confirmar</span>`
                        : alerta.estadoAlerta === 'confirmado'
                            ? `<span class="estadoact">Confirmado</span>`
                            : `<span>${alerta.estadoAlerta}</span>`;

                    fila.innerHTML = `
                        <td>${alerta.horaTexto}</td>
                        <td>${nombreMedicamento}</td>
                        <td>${estadoAlerta}</td>
                        <td><a class="infoTabla">${alerta.tipoAlerta}</a></td>
                        <td>${cantidadUnidad === 20 ? '20' : cantidadUnidad}</td>
                    `;

                    const celdaAccion = document.createElement("td");
                    if (idMedicamento) {
                        const urlCantidad = `https://medicade-back.involux.es/pacientes/VerCantidadDeMisMedicamentos/pacientes/${idPaciente}/medicamentos/${idMedicamento}`;

                        axios.get(urlCantidad)
                            .then(response => {
                                const stock = response.data ? response.data.cantidadDisponible : "No disponible";
                                celdaAccion.innerHTML = `<span class="alertunidades">${stock} Uds/Stk</span>`;
                            })
                            .catch(error => {
                                console.error("Error al obtener la cantidad:", error);
                                celdaAccion.innerHTML = `<span style="color: red; font-weight: bold;">Error al obtener</span>`;
                            });
                    } else {
                        celdaAccion.innerHTML = `<span style="color: red; font-weight: bold;">ID inválido</span>`;
                    }

                    fila.appendChild(celdaAccion);

                    const idResaltado = localStorage.getItem("alertaResaltarId");
                    if (idResaltado && idMedicamento && idMedicamento.toString() === idResaltado) {
                        fila.style.backgroundColor = "#fff3cd";
                        fila.style.border = "2px solid #ffc107";
                        localStorage.removeItem("alertaResaltarId");
                    }

                    cuerpoTabla.appendChild(fila);
                });
            }

            alertasContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            alertasContainer.innerHTML = "<p>Error al cargar las alertas.</p>";
        });

    // ✅ FUNCIONALIDAD NUEVA: registrar tomas vencidas automáticamente
    function registrarTomasVencidas() {
        const urlVencidas = "https://medicade-back.involux.es/pacientes/registrar-tomas-vencidas";
        axios.post(urlVencidas)
            .then(response => {
                console.log("✅ Tomas vencidas registradas correctamente.", response.data);
            })
            .catch(error => {
                console.error("❌ Error al registrar tomas vencidas:", error);
            });
    }

    // ✅ Temporizador solo en consola
    let segundosRestantes = 60;

    function actualizarTemporizador() {
        console.log(`⏳ Próxima comprobación en: ${segundosRestantes}s`);
        segundosRestantes--;
        if (segundosRestantes < 0) {
            registrarTomasVencidas();
            segundosRestantes = 60;
        }
    }

    // Primera ejecución
    registrarTomasVencidas();
    actualizarTemporizador();
    setInterval(actualizarTemporizador, 1000);
});
