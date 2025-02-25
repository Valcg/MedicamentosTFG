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
                <th>Stock</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const cuerpoTabla = tabla.querySelector("tbody");

    // PETICIÓN GET CON AXIOS PARA OBTENER LAS ALERTAS DEL PACIENTE CON ID 1
    axios.get("http://localhost:9050/pacientes/VermisAlertas/1")
        .then(res => {
            const alertas = res.data; // DATOS DE LAS ALERTAS
            console.log(alertas); // Verifica los datos que estás recibiendo

            // SI NO HAY ALERTAS, MOSTRAR MENSAJE
            if (alertas.length === 0) {
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
                    const stock = alerta.medicamento ? alerta.medicamento.stock : 'No disponible';

                    // Agregar los valores de cada alerta a las celdas de la fila
                    fila.innerHTML = `
                        <td>${fechaHoraFormateada}</td>
                        <td>${alerta.estadoAlerta}</td>
                        <td>${alerta.tipoAlerta}</td>
                        <td>${nombreMedicamento}</td>
                        <td>${stock}</td>
                    `;
                    cuerpoTabla.appendChild(fila);
                });
            }

            // AGREGAR LA TABLA AL DOM
            alertasContainer.appendChild(tabla);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
