async function verContactosDePaciente(idPaciente, nombrePaciente) {
    console.log("Paciente ID recibido:", idPaciente, "Nombre:", nombrePaciente);
    const contenedor = document.getElementById("historial-pacientes");
    contenedor.innerHTML = "<p>Cargando contactos...</p>";

    let relacionesEnumGlobal = [];
    let contactos = [];

    try {
        const resRelaciones = await axios.get("http://localhost:9050/pacientes/relacionesContactoEmergencia");
        relacionesEnumGlobal = resRelaciones.data;
        console.log("Relaciones obtenidas:", relacionesEnumGlobal);
    } catch (err) {
        console.error("Error al obtener relaciones:", err);
        contenedor.innerHTML = "<p>Error al cargar las relaciones.</p>";
        return;
    }

    try {
        const urlContactos = `http://localhost:9050/pacientes/contacto-emergencia-por-paciente/${idPaciente}`;
        console.log("Consultando contactos con URL:", urlContactos);
        const resContactos = await axios.get(urlContactos);
        contactos = resContactos.data;
        console.log("Contactos obtenidos:", contactos);
    } catch (err) {
        console.error("Error al obtener contactos:", err);
        contenedor.innerHTML = "<p>Error al cargar los contactos.</p>";
        return;
    }

    if (!Array.isArray(contactos) || contactos.length === 0) {
        contenedor.innerHTML = "<p>No hay contactos disponibles.</p>";
        return;
    }

    contenedor.innerHTML = ""; // Limpiamos para agregar contacto editable

    contactos.forEach(contacto => {
        const divContacto = document.createElement("div");
        divContacto.className = "pacUnContacto";
        divContacto.style = "border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;";

        // Crear select para relación
        const selectRelacion = document.createElement("select");
        selectRelacion.classList.add("input-relacionEnum", "input");
        relacionesEnumGlobal.forEach(rel => {
            const option = document.createElement("option");
            option.value = rel;
            option.text = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase();
            if (rel === contacto.relacionEnum) option.selected = true;
            selectRelacion.appendChild(option);
        });

        divContacto.innerHTML = `
            <div class="mensaje" style="color: red; text-align:center; margin-bottom:10px;"></div>
            <h3>CONTACTO<br><strong>${contacto.nombre}</strong></h3>
            <table>
                <tbody>
                    <tr><td>Nombre<br><input type="text" class="input-nombre input" value="${contacto.nombre || ""}" required></td></tr>
                    <tr><td>Teléfono<br><input type="text" class="input-telefono input" value="${contacto.telefono || ""}" required></td></tr>
                    <tr><td>Relación<br><div class="select-container"></div></td></tr>
                    <tr><td>Relación Específica<br><input type="text" class="input-relacionEspecifica input" value="${contacto.relacionEspecifica || ""}" required></td></tr>
                    <tr><td>Comentarios<br><input type="text" class="input-comentarios input" value="${contacto.comentarios || ""}" required></td></tr>
                    <tr><td>Correo<br><input type="email" class="input-correo input" value="${contacto.correo || ""}" required></td></tr>
                    <tr>
                        <td style="text-align:center;">
                            <button class="btn-guardar" data-id="${contacto.idContacto}">Guardar Cambios</button>
                            <button class="btn-eliminar" data-id="${contacto.idContacto}">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        divContacto.querySelector(".select-container").appendChild(selectRelacion);
        contenedor.appendChild(divContacto);

        // Eventos para guardar y eliminar
        divContacto.querySelector(".btn-guardar").addEventListener("click", function () {
            const contenedorContacto = this.closest(".pacUnContacto");
            const id = this.getAttribute("data-id");
            modificarContactoEnTabla(id, contenedorContacto, idPaciente);
        });

        divContacto.querySelector(".btn-eliminar").addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            eliminarContacto(id, idPaciente);
        });
    });

    function modificarContactoEnTabla(id, contenedor, idPacienteParam) {
        const inputs = contenedor.querySelectorAll("input, select");
        const mensaje = contenedor.querySelector(".mensaje");
        mensaje.textContent = ""; // Limpiar mensaje previo
        mensaje.style.color = "red";

        for (const input of inputs) {
            if (!input.value.trim()) {
                mensaje.textContent = "Por favor, completa todos los campos antes de guardar.";
                input.focus();
                return;
            }
        }

        const contactoActualizado = {
            idContacto: parseInt(id),
            nombre: contenedor.querySelector(".input-nombre").value.trim(),
            telefono: contenedor.querySelector(".input-telefono").value.trim(),
            relacionEnum: contenedor.querySelector(".input-relacionEnum").value,
            relacionEspecifica: contenedor.querySelector(".input-relacionEspecifica").value.trim(),
            comentarios: contenedor.querySelector(".input-comentarios").value.trim(),
            correo: contenedor.querySelector(".input-correo").value.trim(),
            paciente: {
                idPaciente: idPacienteParam ? parseInt(idPacienteParam) : null
            }
        };

        axios.put("http://localhost:9050/pacientes/modificar-contacto-emergencia", contactoActualizado)
            .then(() => {
                mensaje.style.color = "green";
                mensaje.textContent = "Contacto actualizado correctamente.";
            })
            .catch(err => {
                console.error("Error al actualizar contacto:", err);
                mensaje.style.color = "red";
                mensaje.textContent = "Error al actualizar el contacto.";
            });
    }

    function eliminarContacto(id, idPacienteParam) {
        if (!confirm("¿Seguro que deseas eliminar este contacto?")) return;

        const contactoAEliminar = {
            idContacto: parseInt(id),
            paciente: {
                idPaciente: idPacienteParam ? parseInt(idPacienteParam) : null
            }
        };

        axios.delete("http://localhost:9050/pacientes/eliminar-contacto-emergencia", { data: contactoAEliminar })
            .then(() => {
                alert("Contacto eliminado.");
                // Recargar contactos
                verContactosDePaciente(idPacienteParam, nombrePaciente);
            })
            .catch(err => {
                console.error("Error al eliminar contacto:", err);
                alert("Error al eliminar el contacto.");
            });
    }
}

// Llamada inicial al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
    const idPaciente = localStorage.getItem("idUsuario");
    const nombrePaciente = localStorage.getItem("nombreUsuario") || "Paciente";

    if (!idPaciente) {
        console.error("No se encontró idPaciente en localStorage.");
        const contenedor = document.getElementById("historial-pacientes");
        if (contenedor) contenedor.innerHTML = "<p>No se pudo obtener información del paciente.</p>";
        return;
    }

    await verContactosDePaciente(idPaciente, nombrePaciente);
});
