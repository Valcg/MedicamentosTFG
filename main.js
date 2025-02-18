document.addEventListener("DOMContentLoaded", function () {
    // FUNCION --- PARA AGREGAR EVENTSO A LOS ENLACES 
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

    //AGREGAR EVENTOS A LOS BOTONES DE NAVEGACION 
    agregarEvento("verperfil", "perfil.html");
    agregarEvento("VerMisRecetas", "recetas.html");
    agregarEvento("VerMisMedicos", "medicos.html");
    agregarEvento("VerMisAlertas", "alertas.html");
    agregarEvento("VerMiHistorialAlertas", "mihistorialtomas.html");
    
});


/*-------------------------------------------------------*/
// async function getRecetas() {
//     let recetas = await axios.get("http://localhost:9050/pacientes/VerMisRecetas/3");
//     console.log("las recetas: ", recetas);
// }