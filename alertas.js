document.addEventListener("DOMContentLoaded", function () {
    // ELEMENTOS DE MANEJO DE DOM
    const alertasContainer = document.getElementById("alertas-container");
    const fragment = document.createDocumentFragment();

    // PETICIÓN GET CON AXIOS PARA OBTENER LAS ALERTAS DEL PACIENTE CON ID 3
    axios.get("http://localhost:9050/pacientes/VermisAlertas/1")
        .then(res => {
            const alertas = res.data; // DATOS DE LAS ALERTAS
            console.log(alertas); // Verifica los datos que estás recibiendo

            // SI NO HAY ALERTAS, MOSTRAR MENSAJE
            if (alertas.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay alertas disponibles.";
                alertasContainer.appendChild(mensaje);
            } else {
                // RECORREMOS CADA ALERTA Y MOSTRAMOS SU INFORMACIÓN
                alertas.forEach(alerta => {
                    const div = document.createElement("div");
                    div.classList.add("alerta-item");

                    // Accediendo al nombre del medicamento y stock
                    const nombreMedicamento = alerta.medicamento ? alerta.medicamento.nombreMedicamento : 'No disponible';
                    const stock = alerta.medicamento ? alerta.medicamento.stock : 'No disponible';

                    // Mostramos los detalles de la alerta, incluyendo el nombre del medicamento y stock
                    div.innerHTML = `<strong>Fecha y Hora:</strong> ${alerta.fechaHoraAlerta} <br>
                                     <strong>Estado:</strong> ${alerta.estadoAlerta} <br>
                                     <strong>Tipo de Alerta:</strong> ${alerta.tipoAlerta} <br>
                                     <strong>Medicamento:</strong> ${nombreMedicamento} <br>
                                     <strong>Stock:</strong> ${stock}`;

                    // AGREGAMOS AL FRAGMENTO PARA OPTIMIZAR RENDIMIENTO
                    fragment.appendChild(div);
                });
            }

            // AGREGAR EL FRAGMENTO AL DOM
            alertasContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
