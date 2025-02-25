document.addEventListener("DOMContentLoaded", function() {
    // Elementos de manejo de DOM
    const axiosLista = document.getElementById("axios");
    const fragment = document.createDocumentFragment();
    
    axios.get("http://localhost:9050/pacientes/VerMisRecetas/1") // Petición GET con Axios
        .then(res => {
            const recetas = res.data; // Datos de las recetas
            console.log(recetas);
            
            // Si no hay recetas, mostrar mensaje
            if (recetas.length === 0) {
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay recetas disponibles.";
                axiosLista.appendChild(mensaje);
            } else {
                // Mostrar dosis, frecuencia y nombre del medicamento
                recetas.forEach(receta => {
                    const div = document.createElement("div");
                    div.classList.add("receta-item");

                    // Extraer el nombre del medicamento (asumiendo que hay al menos un medicamento por receta)
                    let nombreMedicamento = "No especificado"; // Valor por defecto
                    if (receta.medicamentos && receta.medicamentos.length > 0) {
                        nombreMedicamento = receta.medicamentos[0].nombreMedicamento; 
                    }
                    
                    div.innerHTML = `<strong>Medicamento:</strong> ${nombreMedicamento} <br>
                                     <strong>Dosis:</strong> ${receta.dosis} <br>
                                     <strong>Frecuencia:</strong> ${receta.frecuencia} <br>
                                     <strong>Duración del Tratamiento:</strong> ${receta.duracionTratamiento}`;
                    
                    fragment.appendChild(div);
                });
            }
            
            // Agregar el fragmento al DOM
            axiosLista.appendChild(fragment);
        })
        .catch((err) => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
