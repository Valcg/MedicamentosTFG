
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// SECCIÓN: Tabla de Medicamentos
document.addEventListener("DOMContentLoaded", function () {
    function cargarTodosLosMedicamentos() {
        const cuerpoTabla = document.getElementById("cuerpoTabla");

        // Lista de abreviaturas válidas
        const unidades = ["mg/ml", "mcg/dosis", "mg", "ml", "g", "%"];

        axios.get("http://medicade.involux.es/medicos/BuscarTodosLosMedicamentos")
            .then(response => {
                const medicamentos = response.data;
                let contenido = "";

                if (medicamentos.length === 0) {
                    contenido = "<tr><td colspan='3'>No hay medicamentos disponibles.</td></tr>";
                } else {
                    contenido = medicamentos.map(med => {
                        let nombre = med.nombreMedicamento;
                        const cantidad = med.cantidadUnidad;

                        // Buscar unidad dentro del nombre
                        const unidadEncontrada = unidades.find(u => nombre.toLowerCase().includes(u.toLowerCase()));

                        // Si se encuentra la unidad, eliminarla del nombre (con espacios)
                        if (unidadEncontrada) {
                            const regex = new RegExp(`\\s*${unidadEncontrada}\\s*`, 'i');
                            nombre = nombre.replace(regex, ' ').trim();
                        }

                        // Estilo si se encontró unidad
                        const estiloUnidad = unidadEncontrada ? "color: #84CBF1;font-weight:bold; " : "";

                        return `
                            <tr class="tablahover">
                                <td style="font-weight:bold;text-align:right;">${nombre}</td>
                                
                                <td style="${estiloUnidad}; text-align:center;">${unidadEncontrada ? unidadEncontrada : "-"}</td>
                                <td style="text-align:center;">${cantidad}</td>
                            </tr>
                        `;
                    }).join("");
                }

                cuerpoTabla.innerHTML = contenido;
            })
            .catch(error => {
                cuerpoTabla.innerHTML = "<tr><td colspan='3'>Error al cargar medicamentos.</td></tr>";
                console.error(error);
            });
    }

    cargarTodosLosMedicamentos();
});


// -------------------------------------------------------------------------------------------------------------------------------------------------------
// SECCIÓN: Búsqueda de Medicamentos
// -------------------------------------------------------------------------------------------------------------------------------------------------------
//      <label for="nombreMedicamentoBusqueda">Buscar por nombre</label>
document.addEventListener("DOMContentLoaded", function () {
    const contenedorBusqueda = document.getElementById("busquedaMedicamentosContainer");
    contenedorBusqueda.innerHTML = `
        <section id="formBusquedaMedicamento">     
            <input type="text" id="nombreMedicamentoBusqueda" class="input" placeholder="Ej. Paracetamol">
            <br>
            <button id="btnBuscarMedicamento">Buscar</button>
            <div id="resultadoBusqueda"></div>
       </section>
          
    `;

    const inputNombre = document.getElementById("nombreMedicamentoBusqueda");
    const btnBuscar = document.getElementById("btnBuscarMedicamento");
    const resultadoBusqueda = document.getElementById("resultadoBusqueda");
    const tablaBody = document.querySelector("#tablaMedicamentos tbody");
    let medicamentosCargados = [];

    function limpiarTexto(texto) {
        return texto
            .toLowerCase()
            .replace(/[0-9]/g, "")
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function distanciaLevenshtein(a, b) {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
            Array(a.length + 1).fill(0)
        );

        for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const costo = b[i - 1] === a[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + costo
                );
            }
        }

        return matrix[b.length][a.length];
    }

    function similitud(a, b) {
        const str1 = limpiarTexto(a);
        const str2 = limpiarTexto(b);
        const dist = distanciaLevenshtein(str1, str2);
        const maxLen = Math.max(str1.length, str2.length);
        return maxLen === 0 ? 1 : 1 - dist / maxLen;
    }

    function resaltarCoincidencia(texto, palabra) {
        const regex = new RegExp(`(${palabra})`, "gi");
        return texto.replace(regex, "<span style='text-decoration: underline;'>$1</span>");
    }

    function cargarTodosLosMedicamentos() {
        axios.get("http://medicade.involux.es/medicos/BuscarTodosLosMedicamentos")
            .then(response => {
                medicamentosCargados = response.data || [];
                tablaBody.innerHTML = "";

                medicamentosCargados.forEach(med => {
                    const row = `
                        <tr>
                            <td>${med.nombreMedicamento}</td>
                            <td>${med.cantidadUnidad}</td>
                        </tr>
                    `;
                    tablaBody.innerHTML += row;
                });
            })
            .catch(error => {
                tablaBody.innerHTML = "<tr><td colspan='2'>Error al cargar medicamentos.</td></tr>";
                console.error(error);
            });
    }

    btnBuscar.addEventListener("click", function () {
        const nombreInput = inputNombre.value.trim();
        if (!nombreInput) {
            resultadoBusqueda.innerHTML = "<p style='color: #f14343;'>❌ Por favor, ingresa un nombre para buscar.</p>";
            return;
        }

        const nombreLimpio = limpiarTexto(nombreInput);

        const coincidenciasExactas = medicamentosCargados.filter(m =>
            limpiarTexto(m.nombreMedicamento) === nombreLimpio
        );

        const similares = medicamentosCargados
            .map(m => ({
                med: m,
                score: similitud(m.nombreMedicamento, nombreInput)
            }))
            .filter(obj =>
                obj.score >= 0.6 &&
                limpiarTexto(obj.med.nombreMedicamento) !== nombreLimpio
            )
            .sort((a, b) => b.score - a.score);

        const contienePalabra = medicamentosCargados.filter(m => {
            const nombreMed = limpiarTexto(m.nombreMedicamento);
            const sim = similitud(nombreMed, nombreLimpio);
            return nombreMed.includes(nombreLimpio) &&
                nombreMed !== nombreLimpio &&
                sim < 0.6;
        });

        let html = "";

        if (coincidenciasExactas.length > 0) {
            html += "<p style='color: #66b794f1;'>✅ Coincidencias exactas encontradas:</p>";
            coincidenciasExactas.forEach(m => {
                html += `<strong>${m.nombreMedicamento}</strong> | ${m.cantidadUnidad} unidades <br>`;
            });
            html += "";

            if (similares.length > 0) {
                html += `<p '>Medicamentos con nombres similares:</p>`;
                similares.forEach(obj => {
                    html += `<strong>${obj.med.nombreMedicamento}</strong> | ${obj.med.cantidadUnidad} unidades <br>`;
                });
                html += "";
            }

        } else if (similares.length > 0) {
            const sugerido = similares[0].med.nombreMedicamento;
            html += `<p '>🔎 Quizás quisiste decir: <strong>${sugerido}</strong></p>`;
            html += `<p style='color: #84CBF1;'> Medicamentos con nombres similares:</p>`;
            similares.forEach(obj => {
                html += `<strong>${obj.med.nombreMedicamento}</strong> | ${obj.med.cantidadUnidad} unidades <br>`;
            });
            html += "";
        } else if (contienePalabra.length > 0) {
            html += `<p style='color: #84CBF1;'>🔍 Palabras que contienen: <strong>${nombreInput}</strong></p>`;
            contienePalabra.forEach(m => {
                const nombreResaltado = resaltarCoincidencia(m.nombreMedicamento, nombreInput);
                html += `<strong>${nombreResaltado}</strong> | ${m.cantidadUnidad} unidades <br>`;
            });
            html += "";
        } else {
            html = "<p style='color: #f14343;'>❌ No se encontraron coincidencias ni medicamentos similares.</p>";
        }

        resultadoBusqueda.innerHTML = html;
    });

    cargarTodosLosMedicamentos();
});
