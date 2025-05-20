document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("paciente-contactos") || document.body;

    // 📌 Crear el HTML del formulario desde JS
    const seccion = document.createElement("div");
    seccion.id = "seccion-contacto-emergencia";
    seccion.className = "contacto-emergencia";

    seccion.innerHTML = `
    
        <form id="form-contacto" class="formulario-contacto" style="background-color: yellow; padding: 1rem; border-radius: 8px;">
            <input type="text" id="nombre" placeholder="Nombre del contacto" required />
            <input type="number" id="telefono" placeholder="Teléfono" required />
            <select id="relacionEnum" required>
                <option value="">Seleccione una relación</option>
            </select>
            <input type="text" id="relacionEspecifica" placeholder="Relación específica" />
            <input type="text" id="comentarios" placeholder="Comentarios" />
            <input type="email" id="correo" placeholder="Correo electrónico" />
            <button type="submit">Guardar contacto</button>
        </form>
        <div id="mensaje" class="mensaje-contacto mt-2"></div>
    `;
    contenedor.appendChild(seccion);

    // 📌 Lógica del formulario
    const form = document.getElementById("form-contacto");
    const mensaje = document.getElementById("mensaje");
    const selectRelacion = document.getElementById("relacionEnum");

    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        mensaje.innerHTML = "<p>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // 🔄 Cargar opciones del enum desde el backend
    axios.get("http://medicade-back.involux.es/pacientes/relacionesContactoEmergencia")
        .then(res => {
            const relaciones = res.data;
            relaciones.forEach(rel => {
                const option = document.createElement("option");
                option.value = rel;
                option.textContent = rel.charAt(0) + rel.slice(1).toLowerCase();
                selectRelacion.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Error al cargar relaciones:", err);
            mensaje.innerHTML = "<p>Error al cargar las opciones de relación.</p>";
        });

    // ✉️ Enviar formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const contactoEmergencia = {
            nombre: document.getElementById("nombre").value,
            telefono: parseInt(document.getElementById("telefono").value),
            relacionEnum: document.getElementById("relacionEnum").value,
            relacionEspecifica: document.getElementById("relacionEspecifica").value,
            comentarios: document.getElementById("comentarios").value,
            correo: document.getElementById("correo").value,
            paciente: {
                idPaciente: parseInt(idPaciente)
            }
        };

        axios.post("http://medicade-back.involux.es/pacientes/alta-contacto-emergencia", contactoEmergencia)
            .then(res => {
                mensaje.innerHTML = "<p style='color: green;'>Contacto de emergencia guardado con éxito.</p>";
                form.reset();
                setTimeout(() => {
                    location.href = "#paciente-contactos";
                    location.reload();
                }, 1000);
            })
            .catch(err => {
                console.error("Error al guardar contacto:", err);
                mensaje.innerHTML = "<p style='color: red;'>Error al guardar el contacto.</p>";
            });
    });
});
