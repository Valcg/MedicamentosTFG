document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");
    const modalConfirmarToma = document.getElementById("modal-confirmar-toma");
    const closeModalConfirmar = document.getElementById("closeModalConfirmar");
    const confirmarTomaBtn = document.getElementById("confirmarTomaBtn");

    let rowToConfirm; // Para almacenar la fila que se debe confirmar

    // Crear la tabla
    const tabla = document.createElement("table");
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Fecha y Hora de Toma</th>
                <th>Estado de Alerta</th>
                <th>Nombre del Medicamento</th>
                <th>Acción</th>
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
            let historial = res.data;

            if (!historial || historial.length === 0) {
                historialContainer.innerHTML = "<p>No hay historial de tomas disponible.</p>";
            } else {
                // Ordenar el historial por fecha y hora descendente
                historial.sort((a, b) => new Date(b.fechaHoraToma) - new Date(a.fechaHoraToma));

                historial.forEach(toma => {
                    const fila = document.createElement("tr");

                    // Formatear fecha y hora a "DD/MM/YYYY HH:MM"
                    const fechaHora = new Date(toma.fechaHoraToma);
                    const dia = fechaHora.getDate().toString().padStart(2, '0');
                    const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
                    const anio = fechaHora.getFullYear();
                    const hora = fechaHora.getHours().toString().padStart(2, '0');
                    const minutos = fechaHora.getMinutes().toString().padStart(2, '0');
                    const fechaHoraFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`;

                    // Verificar que los datos existen antes de acceder a ellos
                    const estadoAlerta = toma.alerta ? toma.alerta.estadoAlerta : 'No disponible';
                    const nombreMedicamento = toma.alerta && toma.alerta.medicamento ? toma.alerta.medicamento.nombreMedicamento : 'No disponible';

                    // Crear celda de estado con color si es confirmado
                    let estadoHTML = `<td>${estadoAlerta}</td>`;
                    if (estadoAlerta === "confirmado") {
                        estadoHTML = `<td style="color: green;">Confirmada</td>`;
                    }

                    // Crear botón de confirmación si el estado es "sinConfirmar"
                    let accionHTML = "<td></td>";
                    if (estadoAlerta === "sinConfirmar") {
                        accionHTML = `<td><button class="confirm-btn">Confirmar</button></td>`;
                    }

                    fila.innerHTML = `
                        <td>${fechaHoraFormateada}</td>
                        ${estadoHTML}
                        <td>${nombreMedicamento}</td>
                        ${accionHTML}
                    `;

                    // Agregar la fila a la tabla
                    cuerpoTabla.appendChild(fila);

                    // Agregar funcionalidad al botón de confirmación
                    const confirmarBtn = fila.querySelector(".confirm-btn");
                    if (confirmarBtn) {
                        confirmarBtn.addEventListener("click", function () {
                            rowToConfirm = fila;  // Almacenar la fila a confirmar
                            modalConfirmarToma.style.display = "flex"; // Mostrar la modal
                        });
                    }
                });
            }

            historialContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            historialContainer.innerHTML = "<p>Error al cargar el historial.</p>";
        });

    // Cerrar la modal
    closeModalConfirmar.addEventListener("click", function () {
        modalConfirmarToma.style.display = "none";
    });

    // Confirmar la toma
    confirmarTomaBtn.addEventListener("click", function () {
        if (rowToConfirm) {
            // Cambiar estado a confirmado visualmente
            rowToConfirm.cells[1].textContent = "Confirmada";
            rowToConfirm.cells[1].style.color = "green";
            rowToConfirm.querySelector(".confirm-btn").style.display = "none"; // Ocultar el botón
        }
        modalConfirmarToma.style.display = "none"; // Cerrar la modal
    });
});