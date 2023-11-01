document.addEventListener("DOMContentLoaded", function() {
    const input = document.querySelector('.valBusqueda');
    const btn = document.querySelector('.btnBusqueda');

    btn.addEventListener('click', function(){
        let inputText = input.value;
        if(inputText !=''){
            
        fetch(`/inventario/buscar/${inputText}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.table tbody');
            tableBody.innerHTML = ''; // Limpia la tabla actual

            data.productos.forEach(producto => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.autor}</td>
                    <td>${producto.genero}</td>
                    <td>
                        <a href="inventario/editar/${producto.idUsuariosLibros}" class="btn btn-info">Editar</a>
                        <a href="inventario/eliminar/${producto.idUsuariosLibros}" class="btn btn-danger">Eliminar</a>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });

            console.log('Resultados de la búsqueda:', data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
        });
        console.log('el valor a buscar es: '+inputText);
        }else{
            window.location.href = '/inventario';
        }
    });
});
