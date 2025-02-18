document.addEventListener("DOMContentLoaded", function() {
    // Elementos de manejo de DOM
    const axiosLista = document.getElementById("axios");
    const fragment = document.createDocumentFragment();
    axios.get("http://localhost:9050/pacientes/VerMisRecetas/3") // Petición GET con Axios
    // axios.get("http://localhost:9050/pacientes/VerMisRecetas/{idPaciente}") // Petición GET con Axios
        .then(res => {
            const recetas = res.data; // Datos de las recetas
            console.log(recetas);
            // Si no hay recetas, mostrar mensaje
            if (recetas.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No hay recetas disponibles.";
                fragment.appendChild(li);
            } else {
                // Mostrar dosis y frecuencia de las recetas
                recetas.forEach(recetas => {
                    const li = document.createElement("li");
                    li.innerHTML = `${recetas.dosis} --- ${recetas.frecuencia} --- ${recetas.duracionTratamiento
                    }`;
                    fragment.appendChild(li);
                });
            }

            // Agregar el fragmento al DOM
            axiosLista.appendChild(fragment);
        })
        .catch((err) => {
            console.error("Hubo un fallo en la petición: " + err);
        });
});
