document.addEventListener("DOMContentLoaded", function () {
    const correo = localStorage.getItem("correo");

    if (!correo) {
        document.getElementById("mensaje").innerText = "No se encontró el correo del usuario.";
        return;
    }

    axios.get(`http://localhost:9050/pacientes/contacto-emergencia-por-paciente/${correo}`)
        .then(response => {
            const contactos = response.data;
            const tabla = document.getElementById("tabla-contactos");
            tabla.innerHTML = ""; // Limpiar contenido previo

            if (contactos.length === 0) {
                document.getElementById("mensaje").innerText = "No hay contactos de emergencia.";
                return;
            }

            contactos.forEach(contacto => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${contacto.nombre}</td>
                    <td>${contacto.telefono}</td>
                    <td>${contacto.relacionEnum}</td>
                    <td>${contacto.relacionEspecifica || ''}</td>
                    <td>${contacto.comentarios || ''}</td>
                    <td>${contacto.correo || ''}</td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error al obtener los contactos de emergencia:", error);
            document.getElementById("mensaje").innerText = "Error al cargar los contactos de emergencia.";
        });
});
