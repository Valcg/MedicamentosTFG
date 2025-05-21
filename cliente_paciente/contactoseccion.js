document.addEventListener("DOMContentLoaded", async function () {
    const correo = localStorage.getItem("correo");
    const idPaciente = localStorage.getItem("idUsuario"); // para enviar en modificar/eliminar si quieres
    const divAlta = document.querySelector(".pacUnContactoAlta");

    // Limpiar contactos previos
    document.querySelectorAll(".pacUnContacto").forEach(e => e.remove());

    let relacionesEnumGlobal = [];
    let contactos = [];

    try {
        const resRelaciones = await axios.get("http://localhost:9050/pacientes/relacionesContactoEmergencia");
        relacionesEnumGlobal = resRelaciones.data;
    } catch (err) {
        console.error("Error al obtener relaciones:", err);
        return;
    }

    try {
        const resContactos = await axios.get(`http://localhost:9050/pacientes/contacto-emergencia-por-paciente/${correo}`);
        contactos = resContactos.data;
    } catch (err) {
        console.error("Error al obtener contactos:", err);
        return;
    }

    contactos.forEach(contacto => {
        const divContacto = document.createElement("div");
        divContacto.className = "pacUnContacto";

        // Crear select dinámico para relacionEnum con clase para buscar después
        const selectRelacion = document.createElement("select");
        selectRelacion.classList.add("input-relacionEnum");
        relacionesEnumGlobal.forEach(rel => {
            const option = document.createElement("option");
            option.value = rel;
            option.text = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase();
            if (rel === contacto.relacionEnum) option.selected = true;
            selectRelacion.appendChild(option);
        });

        // Construir tabla con inputs con clases iguales a las del antiguo JS
        divContacto.innerHTML = `
            <div class="mensaje"></div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Relación</th>
                        <th>Relación Específica</th>
                        <th>Comentarios</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" class="input-nombre" value="${contacto.nombre}" /></td>
                        <td><input type="number" class="input-telefono" value="${contacto.telefono}" /></td>
                        <td class="select-container"></td>
                        <td><input type="text" class="input-relacionEspecifica" value="${contacto.relacionEspecifica || ''}" /></td>
                        <td><input type="text" class="input-comentarios" value="${contacto.comentarios || ''}" /></td>
                        <td><input type="text" class="input-correo" value="${contacto.correo || ''}" /></td>
                        <td>
                            <button class="btn-guardar" data-id="${contacto.idContacto}">GUARDAR</button>
                            <button class="btn-eliminar" data-id="${contacto.idContacto}">X</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        divContacto.querySelector(".select-container").appendChild(selectRelacion);

        // Insertar después del formulario de alta
        divAlta.insertAdjacentElement("afterend", divContacto);

        // Eventos para guardar (corregido para obtener fila correcta)
        divContacto.querySelector(".btn-guardar").addEventListener("click", function () {
            const fila = this.closest("tr");  // <---- aquí el cambio
            const id = this.getAttribute("data-id");
            modificarContactoEnTabla(id, fila);
        });

        // Eventos para eliminar
        divContacto.querySelector(".btn-eliminar").addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            eliminarContacto(id);
        });
    });

    // Función para modificar contacto
    function modificarContactoEnTabla(id, fila) {
        const contactoActualizado = {
            idContacto: parseInt(id),
            nombre: fila.querySelector(".input-nombre").value,
            telefono: parseInt(fila.querySelector(".input-telefono").value),
            relacionEnum: fila.querySelector(".input-relacionEnum").value,
            relacionEspecifica: fila.querySelector(".input-relacionEspecifica").value,
            comentarios: fila.querySelector(".input-comentarios").value,
            correo: fila.querySelector(".input-correo").value,
            paciente: {
                idPaciente: idPaciente ? parseInt(idPaciente) : null
            }
        };

        axios.put("http://localhost:9050/pacientes/modificar-contacto-emergencia", contactoActualizado)
            .then(() => {
                alert("Contacto actualizado correctamente.");
            })
            .catch(err => {
                console.error("Error al actualizar contacto:", err);
                alert("Error al actualizar el contacto.");
            });
    }

    // Función para eliminar contacto
    function eliminarContacto(id) {
        if (!confirm("¿Seguro que deseas eliminar este contacto?")) return;

        const contactoAEliminar = {
            idContacto: parseInt(id),
            paciente: {
                idPaciente: idPaciente ? parseInt(idPaciente) : null
            }
        };

        axios.delete("http://localhost:9050/pacientes/eliminar-contacto-emergencia", { data: contactoAEliminar })
            .then(() => {
                alert("Contacto eliminado.");
                location.reload();
            })
            .catch(err => {
                console.error("Error al eliminar contacto:", err);
                alert("Error al eliminar el contacto.");
            });
    }
});
