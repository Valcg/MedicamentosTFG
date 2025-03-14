document.addEventListener("DOMContentLoaded", function () {
    // ELEMENTOS DE MANEJO DE DOM
    const alertasContainer = document.getElementById("mis-alertas-medicas");

    // Crear la tabla
    const tabla = document.createElement("table");
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Fecha y Hora</th>
                <th>Estado</th>
                <th>Tipo de Alerta</th>
                <th>Medicamento</th>
                <th>Cantidad por Unidad de cada caja/blister/frasco</th>
                <th>Acción</th> <!-- Nueva columna para el botón de confirmación -->
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const cuerpoTabla = tabla.querySelector("tbody");

    // OBTENER EL idPaciente DESDE localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    // VALIDAR QUE EL idPaciente EXISTA
    if (!idPaciente) {
        alertasContainer.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // Construir la URL con el idPaciente
    const url = `http://localhost:9050/pacientes/VermisAlertas/${idPaciente}`;

    // PETICIÓN GET CON AXIOS PARA OBTENER LAS ALERTAS DEL PACIENTE
    axios.get(url)
        .then(res => {
            const alertas = res.data; // DATOS DE LAS ALERTAS
            console.log(alertas); // Verifica los datos que estás recibiendo

            // SI NO HAY ALERTAS, MOSTRAR MENSAJE
            if (!alertas || alertas.length === 0) {
                alertasContainer.innerHTML = "<p>No hay alertas disponibles.</p>";
            } else {
                // RECORREMOS CADA ALERTA Y AGREGAMOS UNA FILA A LA TABLA
                alertas.forEach(alerta => {
                    const fila = document.createElement("tr");

                    // Obtener la fecha y hora formateada en "DD/MM/YYYY HH:MM"
                    const fechaHora = new Date(alerta.fechaHoraAlerta);
                    const dia = fechaHora.getDate().toString().padStart(2, '0'); // DD
                    const mes = (fechaHora.getMonth() + 1).toString().padStart(2, '0'); // MM
                    const anio = fechaHora.getFullYear(); // YYYY
                    const hora = fechaHora.getHours().toString().padStart(2, '0'); // HH
                    const minutos = fechaHora.getMinutes().toString().padStart(2, '0'); // MM
                    const fechaHoraFormateada = `${dia}/${mes}/${anio} ${hora}:${minutos}`; // Formato final

                    // Accediendo al nombre del medicamento y stock
                    const nombreMedicamento = alerta.medicamento ? alerta.medicamento.nombreMedicamento : 'No disponible';
                    const cantidadUnidad = alerta.medicamento ? alerta.medicamento.cantidadUnidad : 'No disponible';

                    // Crear el enlace <a>
                    const enlace = document.createElement("a");
                    enlace.href = "#";
                    enlace.textContent = "VER MI CANTIDAD DISPONIBLE";
                    enlace.classList.add("ver-stock-link"); // Clase para el estilo

                    // Evento para el enlace
                    enlace.addEventListener("click", function(event) {
                        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
                        // Lógica para mostrar el stock disponible
                        const stockMedicamento = alerta.medicamento ? alerta.medicamento.stock : "No disponible"; // Reemplazar con el valor real del stock
                        alert(`Cantidad disponible de ${nombreMedicamento}: ${stockMedicamento}`);
                    });

                    // Crear el botón de Confirmar
                    const confirmarBtn = document.createElement("button");
                    confirmarBtn.textContent = "Confirmar";
                    confirmarBtn.classList.add("confirm-btn");

                    // Crear el comportamiento para el botón "Confirmar"
                    confirmarBtn.addEventListener("click", function() {
                        // Cambiar el color del texto en la columna "Estado"
                        const estadoCelda = fila.querySelector("td:nth-child(2)"); // Obtener la celda "Estado"
                        estadoCelda.style.color = "green"; // Cambiar el color a verde
                        estadoCelda.textContent = "Confirmada"; // Cambiar el texto del estado a "Confirmada"
                        confirmarBtn.style.display = "none"; // Ocultar el botón de confirmación
                    });

                    // Agregar los valores de cada alerta a las celdas de la fila
                    fila.innerHTML = `
                        <td>${fechaHoraFormateada}</td>
                        <td>${alerta.estadoAlerta}</td>
                        <td>${alerta.tipoAlerta}</td>
                        <td>${nombreMedicamento}</td>
                        <td>${cantidadUnidad}</td>
                        <td></td> <!-- Columna para el enlace y el botón de acción -->
                    `;

                    // Si el estado de la alerta es "Confirmada", ocultar el botón "Confirmar"
                    if (alerta.estadoAlerta === "confirmado") {
                        fila.querySelector("td:nth-child(2)").style.color = "green"; // Cambiar color de estado a verde
                        fila.querySelector("td:nth-child(2)").textContent = "Confirmada"; // Actualizar el texto de estado
                    } else if (alerta.estadoAlerta === "sinConfirmar") {
                        // Si el estado es "SinConfirmar", mostrar el botón de confirmar
                        fila.querySelector("td:nth-child(6)").appendChild(confirmarBtn); // Agregar el botón de confirmar
                    }

                    // Añadir el enlace en la penúltima columna (Acción)
                    fila.querySelector("td:nth-child(6)").appendChild(enlace);

                    // Añadir la fila a la tabla
                    cuerpoTabla.appendChild(fila);
                });
            }

            // AGREGAR LA TABLA AL DOM
            alertasContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
            alertasContainer.innerHTML = "<p>Error al cargar las alertas.</p>";
        });
});
