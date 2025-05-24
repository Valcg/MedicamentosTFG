document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("paciente-contactos") || document.body;

    // 📌 Crear el HTML del formulario desde JS
    const seccion = document.createElement("div");

    seccion.innerHTML = `
      <form id="form-contacto">

            <h2>Dar de Alta <br> <strong>Nuevo Contacto</strong></h2>
            <table id="tablapacAltaContacto">
                <tbody>
                    <tr>
                        <td>
                            Nombre
                            <br>
                            <input type="text" id="nombre" class="input" placeholder="Nombre del contacto" required />
                        </td>
                    </tr>
               
                    <tr>
                        <td>
                            Teléfono
                            <br>
                            <input type="number" id="telefono" class="input" placeholder="Teléfono" required />
                        </td>
                    </tr>
           
                    <tr>
                        <td>
                            Relación
                            <br>
                            <select id="relacionEnum" required class="input">
                                <option value="">Seleccione una relación</option>
                            </select>
                        </td>
                    </tr>
      
                    <tr>
                        <td>
                            Relación Específica
                            <br>
                            <input type="text" id="relacionEspecifica" class="input" placeholder="Relación específica" required />
                        </td>
                    </tr>
                 
                    <tr>
                        <td>
                            Comentarios
                            <br>
                            <input type="text" id="comentarios" class="input" placeholder="Comentarios" required />
                        </td>
                    </tr>
                
                    <tr>
                        <td>
                            Correo
                            <br>
                            <input type="email" id="correo" class="input" placeholder="Correo electrónico" required />
                        </td>
                    </tr>
                    
                    <!-- Mensaje de validación aparecerá aquí, antes del botón -->
                    <tr>
                        <td>
                            <div id="mensaje" class="mensaje-contacto mt-2"></div>
                        </td>
                    </tr>

                    <tr>
                        <td style="text-align:center;">
                            <button type="submit" class="btnAñadirContacto hover">Guardar contacto</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    `;

    contenedor.appendChild(seccion);

    // 📌 Lógica del formulario
    const form = document.getElementById("form-contacto");
    const mensaje = document.getElementById("mensaje");
    const selectRelacion = document.getElementById("relacionEnum");

    const idPaciente = localStorage.getItem("idUsuario");

    if (!idPaciente) {
        mensaje.innerHTML = "<p style='color: red;'>Error: No se encontró el ID del paciente en localStorage.</p>";
        return;
    }

    // 🔄 Cargar opciones del enum desde el backend
    axios.get("http://localhost:9050/pacientes/relacionesContactoEmergencia")
        .then(res => {
            const relaciones = res.data;
            relaciones.forEach(rel => {
                const option = document.createElement("option");
                option.value = rel;
                option.textContent = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase();
                selectRelacion.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Error al cargar relaciones:", err);
            mensaje.innerHTML = "<p style='color: red;'>Error al cargar las opciones de relación.</p>";
        });

    // ✉️ Enviar formulario con validación obligatoria en todos los campos
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Limpiar mensaje previo
        mensaje.innerHTML = "";

        // Obtener y limpiar valores de espacios en blanco
        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const relacionEnum = document.getElementById("relacionEnum").value.trim();
        const relacionEspecifica = document.getElementById("relacionEspecifica").value.trim();
        const comentarios = document.getElementById("comentarios").value.trim();
        const correo = document.getElementById("correo").value.trim();

        // Validar que TODOS los campos tengan contenido
        if (!nombre || !telefono || !relacionEnum || !relacionEspecifica || !comentarios || !correo) {
            mensaje.innerHTML = "<p style='color: red; text-align: center; margin-bottom: 10px;'>Por favor, complete todos los campos obligatorios.</p>";
            return;
        }

        // Validar formato básico correo (opcional, si quieres)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            mensaje.innerHTML = "<p style='color: red; text-align: center; margin-bottom: 10px;'>Por favor, ingrese un correo electrónico válido.</p>";
            return;
        }

        // Crear objeto contacto
        const contactoEmergencia = {
            nombre: nombre,
            telefono: parseInt(telefono),
            relacionEnum: relacionEnum,
            relacionEspecifica: relacionEspecifica,
            comentarios: comentarios,
            correo: correo,
            paciente: {
                idPaciente: parseInt(idPaciente)
            }
        };

        axios.post("http://localhost:9050/pacientes/alta-contacto-emergencia", contactoEmergencia)
            .then(res => {
                mensaje.innerHTML = "<p style='color: green; text-align: center;'>Contacto de emergencia guardado con éxito.</p>";
                form.reset();
                setTimeout(() => {
                    location.href = "#paciente-contactos";
                    location.reload();
                }, 1000);
            })
            .catch(err => {
                console.error("Error al guardar contacto:", err);
                mensaje.innerHTML = "<p style='color: red; text-align: center;'>Error al guardar el contacto.</p>";
            });
    });
});
