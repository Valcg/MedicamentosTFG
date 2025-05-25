document.addEventListener("DOMContentLoaded", async function () {
    const correoPaciente = localStorage.getItem("correo"); // Asumo que aquí tienes el correo del paciente

    if (!correoPaciente) {
        document.getElementById("tablaContactosContainer").innerHTML = "<p>No se encontró el correo del paciente. Por favor, selecciona un paciente primero.</p>";
        return;
    }

    try {
        const response = await axios.get(`http://localhost:9050/pacientes/contacto-emergencia-por-paciente/${correoPaciente}`);
        const contactos = response.data;

        if (contactos.length === 0) {
            document.getElementById("tablaContactosContainer").innerHTML = "<p>No hay contactos de emergencia registrados para este paciente.</p>";
            return;
        }

        // Agrego título con correo y link para subir arriba
        const contenedor = document.getElementById("tablaContactosContainer");
        contenedor.innerHTML = `
        
          <h2 id="top">Contactos de ${correoPaciente}</h2>
        `;

        let tabla = `<table class="tablaContactosMedicos">
            <thead>
                <tr>
                    <td>Nombre</td>
                    <td>Teléfono</td>
                    <td>Relación</td>
                    <td>Relación Específica</td>
                    <td>Comentarios</td>
                    <td>Correo</td>
                </tr>
            </thead>
            <tbody>`;

        contactos.forEach(contacto => {
            tabla += `
                <tr class="tablahover">
                    <td><strong>${contacto.nombre}</strong></td>
                    <td><span class="infoContacto" style="color:#84CBF1;">${contacto.telefono}</span></td>
                    <td><span class="infoContacto" style ="color :rgb(207, 139, 51);">${contacto.relacionEnum}</span></td>
                    <td >${contacto.relacionEspecifica || ''}</td>
                    <td>${contacto.comentarios || ''}</td>
                    <td style="color : #00669C;"><span class="infoContacto" >${contacto.correo || ''}</span></td>
                </tr>`;
        });

        tabla += "</tbody></table>";

        contenedor.innerHTML += tabla;

    } catch (error) {
        console.error("Error al obtener contactos de emergencia:", error);
        document.getElementById("tablaContactosContainer").innerHTML = "<p>Error al cargar los contactos de emergencia.</p>";
    }
});
