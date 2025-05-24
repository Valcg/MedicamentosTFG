//-------------------------------------------------------------------------------------------------------------------------------------------------------
//SECCIÓN: Alta de Medicamentos
//------------------------------------------------------------------------------------------------------------------------------------------------------- -->
document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("medicoaltamedicamento") || document.body;

    const formularioHTML = `
        <form id="formAltaMedicamento" style="margin-bottom: 20px;">
            <label for="nombreMedicamento">Nombre del Medicamento</label>                  
            <input type="text" id="nombreMedicamento" class="input" name="nombreMedicamento" required placeholder="Ej: Paracetamol 600 mg">
            <br>
            <label for="unidadMedicamento">Unidad de Medida</label>
            <select id="unidadMedicamento" class="input" name="unidadMedicamento" required style="color:#00669C;">
                <option value="">Seleccione una unidad</option>
                <option value="mg">mg (miligramos)</option>
                <option value="ml">ml (mililitros)</option>
                <option value="mg/ml">mg/ml (miligramos por mililitro)</option>
                <option value="g">g (gramos)</option>
                <option value="%">% (porcentaje de concentración)</option>
                <option value="mcg/dosis">mcg/dosis (microgramos por dosis)</option>
            </select>
            <br>
            <label for="cantidadUnidad">Cantidad Total por Caja</label>
            <input type="number" id="cantidadUnidad" class="input" name="cantidadUnidad" min="1" required placeholder="Cantidad por caja">
            <br>
            <button type="button" id="btnAltaMedicamento">Registrar Medicamento</button>
            <div id="mensajeAlta" style="margin-top: 15px;"></div>
            <div id="nombreRenderizado" style="margin-top: 5px;"></div>
        </form>
    `;

    contenedor.innerHTML = formularioHTML;

    const formularioHtml = document.getElementById("formAltaMedicamento");
    const mensajeAlta = document.getElementById("mensajeAlta");
    const nombreInput = document.getElementById("nombreMedicamento");
    const unidadSelect = document.getElementById("unidadMedicamento");
    const cantidadInput = document.getElementById("cantidadUnidad");
    const nombreRender = document.getElementById("nombreRenderizado");

    let medicamentosExistentes = [];
    let medicamentoExiste = false;

    function cargarMedicamentos() {
        axios.get("http://localhost:9050/medicos/BuscarTodosLosMedicamentos")
            .then(response => {
                medicamentosExistentes = response.data || [];
            })
            .catch(error => {
                console.error("Error al cargar medicamentos existentes:", error);
            });
    }

    cargarMedicamentos();

    function limpiarTexto(texto) {
        return texto
            .toLowerCase()
            .replace(/\b(mg|ml|mg\/ml|g|%|mcg\/dosis)\b/g, "")
            .replace(/[0-9]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function palabras(texto) {
        return limpiarTexto(texto).split(" ").filter(p => p.length > 0);
    }

    function actualizarRenderNombre() {
        const nombre = nombreInput.value.trim();
        const unidad = unidadSelect.value.trim();

        if (nombre && unidad) {
            const nombreSinUnidad = nombre.replace(/\s?(mg|ml|mg\/ml|g|%|mcg\/dosis)$/i, "");
            nombreRender.innerHTML = `El medicamento que vas a dar de alta se registrará como: <strong style="color:#00669C;">${nombreSinUnidad} ${unidad}</strong>`;
        } else {
            nombreRender.innerHTML = "";
        }
    }

    function verificarExistenciaYSimilares() {
        const nombreOriginal = nombreInput.value.trim();
        const unidad = unidadSelect.value.trim();
        const nombreFinal = nombreOriginal.replace(/\s?(mg|ml|mg\/ml|g|%|mcg\/dosis)$/i, "") + " " + unidad;

        const nombreLimpio = limpiarTexto(nombreFinal);
        const palabrasNombre = palabras(nombreFinal);

        if (!nombreLimpio || !unidad) {
            mensajeAlta.innerHTML = "";
            medicamentoExiste = false;
            return;
        }

        const existeExacto = medicamentosExistentes.find(m =>
            m.nombreMedicamento.toLowerCase() === nombreFinal.toLowerCase()
        );

        const similares = medicamentosExistentes.filter(m => {
            const palabrasExistente = palabras(m.nombreMedicamento);
            return palabrasNombre.some(p => palabrasExistente.includes(p));
        });

        if (existeExacto) {
            mensajeAlta.innerHTML = `
                ⚠️ <strong>Este medicamento ya existe:</strong> 
                <p style="color:#f14343;">
                    <br>❗ <strong>${existeExacto.nombreMedicamento}</strong> | 
                    <span>${existeExacto.cantidadUnidad} Cant. Total/Caja</span>
                </p>`;
            medicamentoExiste = true;
        } else if (similares.length > 0) {
            const lista = similares.map(m => `
                ➡️<strong>${m.nombreMedicamento}</strong> | ${m.cantidadUnidad} Cant. Total/Caja<br>`).join("");

            mensajeAlta.innerHTML = `
                <p><strong>Medicamentos con nombre parecido</strong></p>
                <p style="color: #84CBF1;">${lista}</p>`;
            medicamentoExiste = false;
        } else {
            mensajeAlta.innerHTML = "";
            medicamentoExiste = false;
        }
    }

    unidadSelect.addEventListener("change", function () {
        const unidad = unidadSelect.value.trim();
        let nombre = nombreInput.value.trim();

        // Remover unidad anterior si ya la tiene
        nombre = nombre.replace(/\s?(mg|ml|mg\/ml|g|%|mcg\/dosis)$/i, "");

        // Agregar nueva unidad si hay nombre
        if (unidad && nombre) {
            nombreInput.value = `${nombre} ${unidad}`;
        }

        actualizarRenderNombre();
        verificarExistenciaYSimilares();
    });

    nombreInput.addEventListener("input", function () {
        actualizarRenderNombre();
        verificarExistenciaYSimilares();
    });

    document.getElementById("btnAltaMedicamento").addEventListener("click", function () {
        mensajeAlta.innerHTML = "";

        const formData = new FormData(formularioHtml);
        const nombreMedicamento = formData.get("nombreMedicamento").trim();
        const unidad = formData.get("unidadMedicamento").trim();
        const cantidadUnidad = formData.get("cantidadUnidad").trim();

        let errores = [];

        const nombreValido = new RegExp(`\\d+\\s*${unidad}$`, "i").test(nombreMedicamento);
        if (!nombreMedicamento) errores.push("el Nombre del medicamento");
        if (!unidad) errores.push("una Unidad de Medida");
        if (!cantidadUnidad || isNaN(cantidadUnidad) || cantidadUnidad <= 0) errores.push("una Cantidad válida");
        if (!nombreValido) errores.push("una Cantidad numérica antes de la unidad (Ej: Paracetamol <strong>500 </strong> mg)");

        if (errores.length > 0) {
            mensajeAlta.innerHTML = `<p style='color: #f14343;'> ⚠️ FALTA : ${errores.join(" + ")}</p>`;
            return;
        }

        const nombreFinal = nombreMedicamento.replace(/\s?(mg|ml|mg\/ml|g|%|mcg\/dosis)$/i, "") + " " + unidad;

        if (medicamentoExiste) {
            mensajeAlta.innerHTML += `<p style="color:#f14343;"> No puedes registrar este medicamento porque ya existe.</p>`;
            return;
        }

        const medicamento = {
            nombreMedicamento: nombreFinal,
            cantidadUnidad: parseInt(cantidadUnidad)
        };

        axios.post("http://localhost:9050/medicos/AltaMedicamentos", medicamento)
            .then(response => {
                mensajeAlta.innerHTML = `<p style="color: #66b794f1;">✅ Medicamento creado: ${response.data.nombreMedicamento}</p>`;
                setTimeout(() => location.reload(), 1000);
            })
            .catch(error => {
                mensajeAlta.innerHTML = "<p style='color: #f14343;'>❌ Error al crear el medicamento. Intenta nuevamente.</p>";
                console.error(error);
            });
    });
});
