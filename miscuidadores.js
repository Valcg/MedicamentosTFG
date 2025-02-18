document.addEventListener("DOMContentLoaded", function () {
    function cargarCuidadores() {
        const cuidadores = [
            { nombre: "Juan", apellidos: "Pérez Gómez", dni: "12345678A" },
            { nombre: "María", apellidos: "López Fernández", dni: "87654321B" },
            { nombre: "Carlos", apellidos: "Ruiz Martínez", dni: "11223344C" }
        ];

        const tabla = document.getElementById("tablaCuidadores");
        if (!tabla) {
            console.error("Tabla 'tablaCuidadores' no encontrada");
            return;
        }

        //   FILAS --------------Agregar con datos ficticios
        cuidadores.forEach(cuidador => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cuidador.nombre}</td>
                <td>${cuidador.apellidos}</td>
                <td>${cuidador.dni}</td>
                <td><div class="eliminar-btn-miscuidadores">X</div></td>

            `;
            tabla.appendChild(row);
        });
    }

    //CARGAR TABLA EN LA PAG
    cargarCuidadores();
});
