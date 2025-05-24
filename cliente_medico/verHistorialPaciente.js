// VerHistorialPaciente.js
const baseURL = "http://localhost:9050/medicos";
const historialContainer = document.getElementById("historial-pacientes");

function mostrarHistorialDePaciente(idPaciente, nombrePaciente) {
    historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3><p>Cargando...</p>`;

    axios.get(`${baseURL}/VerHistorialDeMisPacientes/${idPaciente}`)
        .then(response => {
            const historial = response.data;

            if (!historial || historial.length === 0) {
                historialContainer.innerHTML = `<h3>Historial de ${nombrePaciente}</h3><p>No hay historial de tomas disponible.</p>`;
                return;
            }

            historial.sort((a, b) => new Date(b.fechaHoraToma) - new Date(a.fechaHoraToma));

            // Primero pedimos los estados disponibles para el filtro
            axios.get("http://localhost:9050/medicos/estadoBuscador")
                .then(enumResponse => {
                    const estados = enumResponse.data;
                    let opcionesEstado = `<option value="">Todos</option>`;
                    estados.forEach(estado => {
                        opcionesEstado += `<option value="${estado}">${estado.replace("_", " ")}</option>`;
                    });

                    let html = `
                        <h3>Historial de ${nombrePaciente}</h3>
                        <div style="margin-bottom: 1rem;" id="filtros-historial">
                            <label for="filtro-desde">Desde:</label>
                            <input type="date" id="filtro-desde">

                            <label for="filtro-hasta">Hasta:</label>
                            <input type="date" id="filtro-hasta">

                            <label for="filtro-estado">Estado:</label>
                            <select id="filtro-estado">${opcionesEstado}</select>

                            <label for="filtro-medicamento">Medicamento:</label>
                            <input type="text" id="filtro-medicamento" placeholder="Nombre del medicamento...">

                            <button id="btn-filtrar">Filtrar</button>
                        </div>
                        <div id="tabla-historial"></div>
                    `;

                    historialContainer.innerHTML = html;
                    renderTabla(historial);

                    document.getElementById("btn-filtrar").addEventListener("click", () => {
                        aplicarFiltros(historial);
                    });

                })
                .catch(err => {
                    console.error("Error al cargar los estados:", err);
                    historialContainer.innerHTML = "<p>Error al cargar los estados del historial.</p>";
                });

        })
        .catch(error => {
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
            console.error(error);
        });
}
function renderTabla(historial) {
    const tbody = historial.map(toma => {
        const fechaHora = new Date(toma.fechaHoraToma);

        const opcionesFecha = { day: '2-digit', month: 'long', year: 'numeric' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

        const fechaTexto = fechaHora.toLocaleDateString('es-ES', opcionesFecha);
        const horaTexto = fechaHora.toLocaleTimeString('es-ES', opcionesHora);

        const medicamento = toma.alerta?.medicamento?.nombreMedicamento || "Sin medicamento";

        const estadoRaw = toma.alerta?.estadoAlerta || "sinConfirmar";
        let claseEstado = "";
        let estadoFormateado = "";

        switch (estadoRaw.toLowerCase()) {
            case "confirmado":
                claseEstado = "estConfirmado";
                estadoFormateado = "Confirmado";
                break;
            case "sinconfirmar":
                claseEstado = "estSinConf";
                estadoFormateado = "Sin Confirmar";
                break;
            case "confirmadatarde":
                claseEstado = "estTarde";
                estadoFormateado = "Confirmada Tarde";
                break;
            default:
                claseEstado = "estDesconocido";
                estadoFormateado = estadoRaw;
        }

        const estadoHTML = `<td><a class="infoHistorial ${claseEstado}">${estadoFormateado}</a></td>`;

        return `
            <tr class="tablahover">
                <td>${fechaTexto}</td>
                <td>${horaTexto}</td>
                ${estadoHTML}
                <td style="font-weight: bold;">${medicamento}</td>
            </tr>`;
    }).join("");

    document.getElementById("tabla-historial").innerHTML = `
        <table class="tablaHistorial">
            <thead>
                <tr>
                    <td>Fecha</td>
                    <td>Hora</td>
                    <td>Estado</td>
                    <td>Medicamento</td>
                </tr>
            </thead>
            <tbody>${tbody}</tbody>
        </table>`;
}



function aplicarFiltros(historial) {
    const desde = document.getElementById("filtro-desde").value;
    const hasta = document.getElementById("filtro-hasta").value;
    const estado = document.getElementById("filtro-estado").value.toLowerCase();
    const medicamento = document.getElementById("filtro-medicamento").value.toLowerCase();

    const filtrado = historial.filter(toma => {
        const fecha = new Date(toma.fechaHoraToma);
        const estadoActual = toma.alerta?.estadoAlerta?.toLowerCase() || "";
        const nombreMedicamento = toma.alerta?.medicamento?.nombreMedicamento?.toLowerCase() || "";

        const cumpleFechaDesde = !desde || fecha >= new Date(desde);
        const cumpleFechaHasta = !hasta || fecha <= new Date(hasta);
        const cumpleEstado = !estado || estadoActual === estado;
        const cumpleMedicamento = !medicamento || nombreMedicamento.includes(medicamento);

        return cumpleFechaDesde && cumpleFechaHasta && cumpleEstado && cumpleMedicamento;
    });

    renderTabla(filtrado);
}
