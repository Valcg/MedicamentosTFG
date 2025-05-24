document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("paciente-contactos") || document.body;

    // 📌 Crear el HTML del formulario desde JS
    const seccion = document.createElement("div");

    seccion.innerHTML = `
      <form id="form-contacto">

            <h2>Dar de Alta <br> <strong ">  Nuevo Contacto</strong></h2>
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
                            <input type="text" id="relacionEspecifica" class="input" placeholder="Relación específica" />
                        </td>
                    </tr>
                 
                    <tr>
                        <td>
                            Comentarios
                            <br>
                            <input type="text" id="comentarios" class="input" placeholder="Comentarios" />
                        </td>
                    </tr>
                
                    <tr>
                        <td>
                            Correo
                            <br>
                            <input type="email" id="correo" class="input" placeholder="Correo electrónico" />
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
    axios.get("https://medicade-back.involux.es/pacientes/relacionesContactoEmergencia")
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

        axios.post("https://medicade-back.involux.es/pacientes/alta-contacto-emergencia", contactoEmergencia)
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
