document.addEventListener("DOMContentLoaded", function () {
    const mensajeAlta = document.getElementById("mensajeAlta");

    document.getElementById("btnAltaMedicamento").addEventListener("click", function () {
        // Obtén el valor del campo nombreMedicamento y cantidadUnidad
        const nombreMedicamento = document.getElementById("nombreMedicamento").value.trim();
        const cantidadUnidad = document.getElementById("cantidadUnidad").value;

        // Validación de que el nombre del medicamento no esté vacío
        if (!nombreMedicamento) {
            mensajeAlta.innerHTML = "<p style='color: red;'>El nombre del medicamento no puede estar vacío.</p>";
            return;  // Detener el envío si el nombre está vacío
        }            

        // Validación de que la cantidad sea válida
        if (!cantidadUnidad || isNaN(cantidadUnidad) || cantidadUnidad <= 0) {
            mensajeAlta.innerHTML = "<p style='color: red;'>Por favor, ingrese una cantidad válida mayor a 0.</p>";
            return;  // Detener el envío si la cantidad es inválida
        }

        // Si todo está bien, construye el objeto para enviar al backend
        const medicamento = {
            nombreMedicamento: nombreMedicamento,
            cantidadUnidad: parseInt(cantidadUnidad)
        };

        // Enviar la solicitud POST al backend
        axios.post("http://localhost:9050/medicos/AltaMedicamentos", medicamento)
            .then(response => {
                mensajeAlta.innerHTML = `<p style="color: green;">Medicamento creado: ${response.data.nombreMedicamento}</p>`;
            })
            .catch(error => {
                mensajeAlta.innerHTML = "<p style='color: red;'>Error al crear el medicamento. Por favor, intente nuevamente.</p>";
                console.error(error);
            });
    });
});
