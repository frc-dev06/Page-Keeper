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

    document.getElementById('comprar').addEventListener('click', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
    
        const cantidad = document.getElementById('cantidad').value;
        const idLibro = document.getElementById('libros').value;
    
        // Si el usuario hace clic en "Aceptar", envía la solicitud
        if (confirm('¿Estás seguro de que quieres comprar este libro?')) {
            fetch('/ventas/comprar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cantidad: cantidad, idLibro: idLibro }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    if (data.error.includes('La cantidad ingresada es mayor que la cantidad disponible')) {
                        alert('La cantidad ingresada es mayor que la cantidad disponible. No se puede realizar la venta.');
                    } else {
                        alert('Error al realizar la compra. ' + data.error);
                    }
                } else {
                    alert('Compra realizada con éxito');
                }
            })
        }
    }
    );