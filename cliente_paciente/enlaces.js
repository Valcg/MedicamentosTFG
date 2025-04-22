// ------------------- enlaces.js -------------------

// FUNCION PARA AGREGAR EVENTOS A LOS ENLACES
function agregarEvento(id, url) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener("click", function () {
            window.location.href = url;
        });
    } else {
        console.error(`Elemento '${id}' no encontrado`);
    }
}

// Espera que el DOM esté listo antes de asignar eventos
document.addEventListener("DOMContentLoaded", function () {
    agregarEvento("verperfil", "cliente_paciente/miperfil.html");
    agregarEvento("VerMisRecetas", "cliente_paciente/misrecetas.html");
    agregarEvento("VerMisMedicos", "cliente_paciente/mismedicos.html");
    agregarEvento("VerMisAlertas", "cliente_paciente/misalertas.html");
    agregarEvento("VerMiHistorialAlertas", "cliente_paciente/mihistorialtomas.html");
});
