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
    agregarEvento("miperfilmedico", "cliente_medico/miperfilmedico.html");
    agregarEvento("seccionpacientes", "cliente_medico/seccionpacientes.html");
    agregarEvento("verseccionmedicamentos", "cliente_medico/seccionmedicamentos.html");
});
