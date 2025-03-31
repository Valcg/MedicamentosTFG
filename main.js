// ------------------- Script 1: Mostrar fecha -------------------
document.addEventListener("DOMContentLoaded", function () {
    // Obtener la fecha actual
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
    const anio = fecha.getFullYear();
  
    // Crear el texto con la fecha
    const textoFecha = `Hoy es : ${anio} / ${mes} / ${dia}`;
  
    // Insertar el texto en el div con id "fecha"
    document.getElementById("fecha").textContent = textoFecha;
});


// ------------------- Script 2: Recuperar datos del localStorage -------------------
document.addEventListener("DOMContentLoaded", function () {
    const nombreUsuario = localStorage.getItem("correo"); // O cualquier campo que guardes con el nombre
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const nombre = localStorage.getItem("nombre");

    // Si los datos existen, actualizamos el HTML
    if(nombre){
        document.getElementById("nombre-usu").innerText = nombre;
    }
    if (nombreUsuario) {
        document.querySelector(".nombre-usuario").textContent = nombreUsuario;
    }
    if (tipoUsuario) {
        document.getElementById("paciente-text").textContent = tipoUsuario;
    }

    // Evento para cerrar sesión
    document.querySelector(".cerrar-sesion-cliente").addEventListener("click", function () {
        // Limpiar localStorage y redirigir a index.html
        localStorage.clear();
        window.location.href = "index.html"; // Redirige a la página de inicio
    });
});

// ------------------- Script 3: Función para agregar eventos a los enlaces -------------------
document.addEventListener("DOMContentLoaded", function () {
    // FUNCION --- PARA AGREGAR EVENTOS A LOS ENLACES
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

    // AGREGAR EVENTOS A LOS BOTONES DE NAVEGACION
    agregarEvento("verperfil", "cliente_paciente/miperfil.html");
    agregarEvento("VerMisRecetas", "cliente_paciente/misrecetas.html");
    agregarEvento("VerMisMedicos", "cliente_paciente/mismedicos.html");
    agregarEvento("VerMisAlertas", "cliente_paciente/misalertas.html");
    agregarEvento("VerMiHistorialAlertas", "cliente_paciente/mihistorialtomas.html");
});
// ------------------- Fin Script 3 -------------------