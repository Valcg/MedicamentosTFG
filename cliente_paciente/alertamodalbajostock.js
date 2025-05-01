document.addEventListener("DOMContentLoaded", () => {
    // Obtener el idPaciente desde localStorage
    const idPaciente = localStorage.getItem("idUsuario");

    // Validar si el idPaciente existe
    if (!idPaciente) {
        console.error("Error: No se encontró el ID del paciente en localStorage.");
        return;  // Detener la ejecución si no se encuentra el idPaciente
    }
    const modalBajoStock = document.getElementById("modalBajoStock");
    const contenidoBajoStock = document.getElementById("contenidoBajoStock");
    const closeModalBtn = document.getElementById("closeModalBajoStockBtn");

    // Cierra el modal
    closeModalBtn.onclick = () => modalBajoStock.style.display = "none";

    // Cada 10 minutos verificar stock
    setInterval(verificarMedicamentosCliente, 600000);
    verificarMedicamentosCliente(); // también al iniciar

    function verificarMedicamentosCliente() {
        axios.get(`http://localhost:9050/pacientes/VerMisMedicamentos/paciente/${idPaciente}`)
            .then(response => {
                const listaMedicamentos = response.data;
                if (!listaMedicamentos) return;

                listaMedicamentos.forEach(med => {
                    verificarStockMedicamento(med.medicamento.idMedicamento);
                });
            });
    }

    function verificarStockMedicamento(idMedicamento) {
        axios.post(`http://localhost:9050/pacientes/verificar-stock/${idPaciente}/${idMedicamento}`)
            .then(response => {
                const mensaje = response.data;
                if (mensaje.includes("alerta de bajostock")) {
                    mostrarModalBajoStock(idMedicamento, mensaje);
                }
            });
    }

    function mostrarModalBajoStock(idMedicamento, mensaje) {
        const idAlerta = idMedicamento;

        contenidoBajoStock.innerHTML = `
            <p>${mensaje}</p>
            <button onclick="confirmarAlertaBajoStock(${idAlerta})" style="background-color: green; color: white; margin-right: 10px;">Confirmar</button>
            <button onclick="posponerAlertaBajoStock(${idAlerta})" style="background-color: orange; color: white;">Posponer</button>
        `;
        // modalBajoStock.style.display = "block";
    }

    window.confirmarAlertaBajoStock = function(idAlerta) {
        axios.post(`http://localhost:9050/pacientes/confirmarAlertaBajoStock/${idAlerta}`)
            .then(res => {
                alert(res.data);
                modalBajoStock.style.display = "none";
            });
    };

    window.posponerAlertaBajoStock = function(idAlerta) {
        axios.post(`http://localhost:9050/pacientes/posponerAlertaBajoStock/${idAlerta}`, {})
            .then(res => {
                alert(res.data);
                modalBajoStock.style.display = "none";
            })
            .catch(err => {
                alert(err.response?.data || "Error al posponer");
                console.error(err);
            });
    };
    
});
