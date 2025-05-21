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
        selectRelacion.classList.add("input-relacionEnum", "input"); // <-- aquí el cambio
        relacionesEnumGlobal.forEach(rel => {
            const option = document.createElement("option");
            option.value = rel;
            option.text = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase();
            if (rel === contacto.relacionEnum) option.selected = true;
            selectRelacion.appendChild(option);
        });

       divContacto.innerHTML = `
    <div class="mensaje" ></div>
    <h3>
        CONTACTO
        <br>
        ${contacto.nombre}
    </h3>
    <table  id="tablapacUnContacto" style="border: solid 1px yellow;">
        <tbody>
            <tr>
                <td>Nombre:
                <br>
                <input type="text" class="input-nombre input" value="${contacto.nombre}" /></td>
            </tr>
            <tr>
                <td>Teléfono
                <br>
                <input type="number" class="input-telefono input" value="${contacto.telefono}" /></td>
            </tr>
            <tr>
                <tr>
                    <td>Relación
                    <br>
                    <div class="select-container"></div>
                    </td>
                </tr>

            </tr>
            <tr>
                <td>Relación Específica
                <br>
                <input type="text" class="input-relacionEspecifica input" value="${contacto.relacionEspecifica || ''}" /></td>
            </tr>
            <tr>
                <td>Comentarios
                <br>
                <input type="text" class="input-comentarios input" value="${contacto.comentarios || ''}" /></td>
            </tr>
            <tr>
                <td>Correo
                <br>
                <input type="text" class="input-correo input" value="${contacto.correo || ''}" /></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align:center;">
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

        // Eventos para guardar (aquí cambio el closest)
        divContacto.querySelector(".btn-guardar").addEventListener("click", function () {
            const contenedorContacto = this.closest(".pacUnContacto");  // cambiar tr por div contenedor
            const id = this.getAttribute("data-id");
            modificarContactoEnTabla(id, contenedorContacto);
        });

        // Eventos para eliminar
        divContacto.querySelector(".btn-eliminar").addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            eliminarContacto(id);
        });
    });

    // Función para modificar contacto
    function modificarContactoEnTabla(id, contenedor) {
        const contactoActualizado = {
            idContacto: parseInt(id),
            nombre: contenedor.querySelector(".input-nombre").value,
            telefono: parseInt(contenedor.querySelector(".input-telefono").value),
            relacionEnum: contenedor.querySelector(".input-relacionEnum").value,
            relacionEspecifica: contenedor.querySelector(".input-relacionEspecifica").value,
            comentarios: contenedor.querySelector(".input-comentarios").value,
            correo: contenedor.querySelector(".input-correo").value,
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
