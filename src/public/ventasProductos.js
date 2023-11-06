document.querySelector('.btnBusqueda').addEventListener('click', function() {
    const searchTerm = document.querySelector('.searchTerm').value; // Obtén el término de búsqueda del campo de entrada

    fetch('/search/' + searchTerm) // Hacer una solicitud AJAX a '/search'
        .then(response => response.json())
        .then(data => {
            // Actualizar la tabla con los resultados de la búsqueda
            const table = document.querySelector('.resultsTable');
            table.innerHTML = ''; // Limpiar la tabla

            data.forEach(row => {
                const tr = document.createElement('tr');

                Object.values(row).forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    tr.appendChild(td);
                });

                table.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
});

document.querySelector('.btnCompra').addEventListener('click', function() {
    const productId = document.querySelector('.productId').value; // Obtén el ID del producto del campo de entrada
    const quantity = document.querySelector('.quantity').value; // Obtén la cantidad del campo de entrada

    fetch('/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }), // Enviar el ID del producto y la cantidad como cuerpo de la solicitud
    })
        .then(response => response.json())
        .then(data => {
            // Mostrar un mensaje indicando si la compra fue exitosa o no
            alert(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});