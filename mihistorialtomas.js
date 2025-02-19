document.addEventListener("DOMContentLoaded", function () {
    const historialContainer = document.getElementById("VerMiHistorialTomas");
    const fragment = document.createDocumentFragment();

    axios.get("http://localhost:9050/pacientes/Vermihistorial/1")
        .then(res => {
            const historial = res.data;
            console.log(historial); // Verificar los datos

            if (historial.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay historial de tomas disponible.";
                historialContainer.appendChild(mensaje);
            } else {
                historial.forEach(toma => {
                    const div = document.createElement("div");
                    div.classList.add("historial-item");

                    // --------------------ACCESO A  :
                    div.innerHTML = `<strong>Fecha y Hora de Toma:</strong> ${toma.fechaHoraToma} <br>
                                     <strong>Estado de Alerta:</strong> ${toma.alerta.estadoAlerta} <br>
                                     <strong>Nombre del Medicamento:</strong> ${toma.alerta.medicamento.nombreMedicamento}`;

                    fragment.appendChild(div);
                });
            }

            historialContainer.appendChild(fragment);
        })
        .catch(err => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
