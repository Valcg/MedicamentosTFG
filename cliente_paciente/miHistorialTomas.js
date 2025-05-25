document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("mi-historial-tomas");
    const tabla = document.createElement("table");
    tabla.id = "tablapacienteMiHistorial";
    const toast = document.getElementById("toast-confirmacion");
    const idPaciente = localStorage.getItem("idUsuario");
    
    // URL para obtener el historial
    const urlHistorial = `http://localhost:9050/pacientes/Vermihistorial/${idPaciente}`;
    
    // Variable para almacenar errores de confirmación
    const confirmacionesFallidas = JSON.parse(localStorage.getItem('confirmacionesFallidas') || "{}");

    if (!idPaciente) {
        historialContainer.innerHTML = "<p>Error: No se encontró el ID del paciente.</p>";
        return;
    }

    tabla.innerHTML = `
        <thead>
            <tr>
                <td>Fecha y Hora de Toma</td>
                <td>Nombre del Medicamento</td>
                <td>Estado de Alerta</td>
                <td></td>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const cuerpoTabla = tabla.querySelector("tbody");

    function obtenerFechaYHoraFormateada(fechaStr) {
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const fecha = new Date(fechaStr);
        return {
            fechaTexto: `${dias[fecha.getDay()].charAt(0).toUpperCase() + dias[fecha.getDay()].slice(1)} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`,
            horaTexto: `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`,
            claveAgrupacion: `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`,
            fechaReal: fecha
        };
    }

    function mostrarToastConfirmacion() {
        if (toast) {
            toast.style.display = "block";
            setTimeout(() => {
                toast.style.display = "none";
            }, 3000);
        }
    }

    async function confirmarToma(idAlerta, fila, btnConfirmar) {
        const mensajesAnteriores = fila.parentNode.querySelectorAll(".mensaje-tabla");
        mensajesAnteriores.forEach(msg => msg.remove());
        
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "Procesando...";

        try {
            const response = await axios.post(`http://localhost:9050/pacientes/confirmarToma/${idAlerta}`);
            
            if (response.status >= 200 && response.status < 300) {
                // Eliminar de confirmaciones fallidas si existe
                if (confirmacionesFallidas[idAlerta]) {
                    delete confirmacionesFallidas[idAlerta];
                    localStorage.setItem('confirmacionesFallidas', JSON.stringify(confirmacionesFallidas));
                }
                
                // Actualizar interfaz
                fila.querySelector("td:nth-child(3)").innerHTML = `<span class="estadotarde">Confirmado Tarde</span>`;
                btnConfirmar.textContent = "Confirmado";
                btnConfirmar.disabled = true;
                
                // Mostrar mensaje de éxito
                const mensajeExito = document.createElement("tr");
                mensajeExito.className = "mensaje-tabla";
                mensajeExito.innerHTML = `
                    <td colspan="4" style="color: green; text-align: center; font-weight: bold;">
                        ✅ Toma confirmada correctamente
                    </td>
                `;
                fila.parentNode.insertBefore(mensajeExito, fila.nextSibling);
                
                mostrarToastConfirmacion();
                fila.style.backgroundColor = "#e8f5e9";
                setTimeout(() => fila.style.backgroundColor = "", 2000);
                setTimeout(() => mensajeExito.remove(), 5000);
            } else {
                throw new Error("Respuesta no exitosa del servidor");
            }
        } catch (error) {
            console.error("Error al confirmar toma:", error);
            
            // Guardar en localStorage que esta confirmación falló
            confirmacionesFallidas[idAlerta] = { timestamp: new Date().getTime() };
            localStorage.setItem('confirmacionesFallidas', JSON.stringify(confirmacionesFallidas));
            
            // Restaurar botón
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "Confirmar";
            
            // Mostrar mensaje de error
            const mensajeError = document.createElement("tr");
            mensajeError.className = "mensaje-tabla";
            mensajeError.innerHTML = `
                <td colspan="4" style="color: #f44336; text-align: center;">
                    ❌ Error: ${error.response?.data?.message || 'No se pudo confirmar (stock bajo o receta caducada)'}
                </td>
            `;
            fila.parentNode.insertBefore(mensajeError, fila.nextSibling);
            
            fila.style.backgroundColor = "#ffebee";
            setTimeout(() => {
                fila.style.backgroundColor = "";
                mensajeError.remove();
            }, 5000);
        }
    }

    function cargarHistorial() {
        axios.get(urlHistorial)
            .then(res => {
                const historial = res.data;
                if (!historial?.length) {
                    historialContainer.innerHTML = "<p>No hay historial disponible.</p>";
                    return;
                }

                // Limpiar confirmaciones fallidas antiguas (más de 1 día)
                const ahora = new Date().getTime();
                const confirmacionesActualizadas = {};
                Object.keys(confirmacionesFallidas).forEach(id => {
                    const fechaError = confirmacionesFallidas[id].timestamp;
                    if (ahora - fechaError < 24 * 60 * 60 * 1000) { // 1 día
                        confirmacionesActualizadas[id] = confirmacionesFallidas[id];
                    }
                });
                localStorage.setItem('confirmacionesFallidas', JSON.stringify(confirmacionesActualizadas));

                const historialAgrupado = historial.reduce((acc, toma) => {
                    const { fechaTexto, horaTexto, claveAgrupacion, fechaReal } = obtenerFechaYHoraFormateada(toma.fechaHoraToma);
                    if (!acc[claveAgrupacion]) {
                        acc[claveAgrupacion] = { fechaTexto, fechaReal, tomas: [] };
                    }
                    
                    // Si la confirmación falló anteriormente, forzar estado "Sin Confirmar"
                    const idAlerta = toma.alerta?.idAlerta;
                    if (idAlerta && confirmacionesActualizadas[idAlerta]) {
                        toma.alerta.estadoAlerta = "sinConfirmar";
                    }
                    
                    acc[claveAgrupacion].tomas.push({ ...toma, horaTexto, fechaToma: fechaReal });
                    return acc;
                }, {});

                cuerpoTabla.innerHTML = '';

                Object.keys(historialAgrupado)
                    .sort((a, b) => historialAgrupado[b].fechaReal - historialAgrupado[a].fechaReal)
                    .forEach(clave => {
                        const { fechaTexto, tomas } = historialAgrupado[clave];
                        
                        const filaTitulo = document.createElement("tr");
                        filaTitulo.innerHTML = `<td colspan="4" style="background-color: #fafafa; padding: 10px;">${fechaTexto}</td>`;
                        cuerpoTabla.appendChild(filaTitulo);

                        tomas.sort((a, b) => b.fechaToma - a.fechaToma).forEach(toma => {
                            const estadoAlerta = toma.alerta?.estadoAlerta || 'No disponible';
                            const nombreMedicamento = toma.alerta?.medicamento?.nombreMedicamento || 'No disponible';
                            
                            let estadoHTML = "";
                            if (estadoAlerta === "confirmado") {
                                estadoHTML = `<td><span class="estadoact">Confirmado</span></td>`;
                            } else if (estadoAlerta === "sinConfirmar") {
                                estadoHTML = `<td><span class="estadoinact">Sin Confirmar</span></td>`;
                            } else if (estadoAlerta === "confirmadaTarde") {
                                estadoHTML = `<td><span class="estadotarde">Confirmado Tarde</span></td>`;
                            } else {
                                estadoHTML = `<td><span>${estadoAlerta}</span></td>`;
                            }

                            let accionHTML = "<td></td>";
                            if (estadoAlerta === "sinConfirmar") {
                                accionHTML = `<td><button class="btnpaconfirmhistorial hover">Confirmar</button></td>`;
                            }

                            const fila = document.createElement("tr");
                            fila.classList.add("tablahover");
                            fila.id = `alerta-${toma.alerta?.idAlerta || toma.id}`;
                            fila.innerHTML = `
                                <td>${toma.horaTexto}</td>
                                <td>${nombreMedicamento}</td>
                                ${estadoHTML}
                                ${accionHTML}
                            `;

                            cuerpoTabla.appendChild(fila);

                            const btnConfirmar = fila.querySelector(".btnpaconfirmhistorial");
                            if (btnConfirmar) {
                                btnConfirmar.addEventListener("click", () => {
                                    confirmarToma(toma.alerta.idAlerta, fila, btnConfirmar);
                                });
                            }
                        });
                    });

                historialContainer.appendChild(tabla);
            })
            .catch(err => {
                console.error("Error al cargar historial:", err);
                historialContainer.innerHTML = `<p>Error al cargar el historial: ${err.message}</p>`;
            });
    }

    cargarHistorial();
});