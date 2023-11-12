document.addEventListener("DOMContentLoaded", function() {
    fetch('/ventas/libros')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.querySelector('#libros');
            data.libros.forEach(libro => {
                const optionElement = document.createElement('option');
                optionElement.value = libro.idLibro;
                optionElement.textContent = libro.nombreLibro;
                selectElement.appendChild(optionElement);
            });
        })
        .catch(error => {
            console.error("Error al cargar libros:", error);
        });
    });

    document.getElementById('comprar').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from being submitted normally
    
        const cantidad = document.getElementById('cantidad').value;
        const idLibro = document.getElementById('libros').value;
    
        // Muestra un cuadro de confirmación
        if (confirm('¿Estás seguro de que quieres comprar este libro?')) {
            // Si el usuario hace clic en "Aceptar", envía la solicitud
            fetch('/ventas/comprar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cantidad: cantidad , idLibro: idLibro }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Compra realizada con éxito');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });