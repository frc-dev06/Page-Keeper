const form = document.querySelector('#reportForm');
const btn = document.querySelector('.btn');
const recomendacion = document.querySelector('.recomendacion')
const tablaInfo = document.querySelector('.tablaInfo')
const btnVentas= document.querySelector('.btnVentas')
const grafico=document.querySelector('.grafico')
const canvas = document.getElementById('myChart');

// Define el ancho y alto deseados
canvas.width = 200;
canvas.height = 100;


let tipoGrafico = 'bar';
let tipoReporte = 'librosCantidad';

function crearGrafico(datos) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const existingChart = window.myChart;

    if (existingChart) {
        if (existingChart instanceof Chart) {
            existingChart.destroy();
        }
    }

    window.myChart = new Chart(ctx, {
        type: tipoGrafico,
        data: datos,
    });
}

function obtenerDatosDelServidor(tipoReporte) {
    return new Promise((resolve, reject) => {
        if (tipoReporte == 'librosCantidad') {
            const url = '/reportes/librosCantidad';
            recomendacion.innerHTML=''
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                })
                .then(data => {
                    const nombres = [];
                    const cantidades = [];

                    data.forEach(element => {
                        nombres.push(element.nombreLibro);
                        cantidades.push(element.cantidad);
                    });

                    console.log({ nombres, cantidades });

                    const chartData = {
                        labels: nombres,
                        datasets: [{
                            label: 'Cantidad disponible',
                            data: cantidades,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    };

                    // crear tabla de sugerencias:
                    //cabecera
                    const headerLi = document.createElement('li');
                    headerLi.className = 'list-group-item cabecera';
                    headerLi.textContent = 'Se recomienda hacer pedido de:';
                    recomendacion.appendChild(headerLi);

                    // encontrar libros que tienen stock en emergencia
                    const lista = data.filter(element => {
                        return element.cantidad <= 5;
                    });
                    // generar listado de productos con stock bajo
                    lista.forEach(element => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = `${element.nombreLibro} solo tienes ${element.cantidad} unidades`;
                        // Agrega el li al ul
                        recomendacion.appendChild(li);
                    })

                    resolve(chartData);
                })
                .catch(error => {
                    // Maneja errores
                    console.error('Error: ' + error);
                    reject(error);
                });
        } else if (tipoReporte == 'ventasGenero') {
            const url = '/reportes/ventasGenero';

            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error en la solicitud');
                    }
                })
                .then(data => {
                    const cantidad = [];
                    const genero = [];

                    data.forEach(element => {
                        cantidad.push(element.cantidadVendida);
                        genero.push(element.nombreGenero);
                    });

                    console.log({ cantidad, genero });

                    const chartData = {
                        labels: genero,
                        datasets: [{
                            label: 'Ventas por Genero',
                            data: cantidad,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    };


                    resolve(chartData);
                })
                .catch(error => {
                    // Maneja errores
                    console.error('Error: ' + error);
                    reject(error);
                });
        } 
    });
}


form.addEventListener('change', function () {
    tipoGrafico = form.elements.chartType.value;
    tipoReporte = form.elements.reportType.value;
});

function obtenerColorAleatorio(cantidad) {
    const letters = '0123456789ABCDEF';
    const colores = [];

    for (let j = 0; j < cantidad; j++) {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        colores.push(color);
    }

    return colores;
}


btn.addEventListener('click', async function (event) {
    event.preventDefault();
    
    grafico.style.display = 'block';
    recomendacion.style.display='block'
    tablaInfo.style.display = 'none';
    
    if (tipoReporte == 'librosCantidad') {
        try {
            // Espera a que se resuelvan los datos del servidor
            const datosDelServidor = await obtenerDatosDelServidor(tipoReporte);
            console.log('el tipo de gráficos es: ' + tipoGrafico);
            console.log('el tipo de reporte es: ' + tipoReporte);

            const coloresAleatorios = obtenerColorAleatorio(datosDelServidor.labels.length);
            datosDelServidor.datasets[0].backgroundColor = coloresAleatorios;
            datosDelServidor.datasets[0].borderColor = coloresAleatorios;

            // Crea el gráfico con los datos obtenidos.
            crearGrafico(datosDelServidor);

        } catch (error) {
            console.error('Error al obtener los datos del servidor: ' + error);
        }
    } else if (tipoReporte == 'ventasGenero') {
        const datosDelServidor = await obtenerDatosDelServidor(tipoReporte);
        crearGrafico(datosDelServidor);
    } 
    else {
        console.log('Por favor, selecciona un tipo de reporte.');
    }

});

btnVentas.addEventListener('click', function(event){
    event.preventDefault();
    grafico.style.display = 'none';
    recomendacion.style.display='none'
    tablaInfo.style.display = 'block';
    tablaInfo.innerHTML=''
    
    
    const url = '/reportes/ventas';

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    // crear tabla
                    const table = document.createElement("table");
                    table.className = "table"; 

                    // encabezado de la tabla
                    const thead = document.createElement("thead");
                    const headerRow = thead.insertRow(0);
                    headerRow.innerHTML = "<th>ID de Venta</th> <th>Fecha</th> <th>Nombre del Producto</th> <th>Cantidad</th>  <th>Precio Unitario</th>  <th>Total</th>";
                    table.appendChild(thead);

                    // cuerpo de la tabla
                    const tbody = document.createElement("tbody");

                    // Itera a través de los datos de ventas y crea filas en la tabla
                    data.forEach((venta) => {
                        const row = tbody.insertRow();
                        row.innerHTML = `<td>${venta.idVenta}</td><td>${venta.fecha}</td><td>${venta.nombreProducto}</td><td>${venta.cantidad}</td> <td>${venta.precioUnitario}</td> <td>${venta.totalVenta}</td>`;
                    });

                    // Agrega el cuerpo a la tabla
                    table.appendChild(tbody);

                    // Agrega la tabla al div "tablaInfo"
                    tablaInfo.appendChild(table);
                })
                .catch((error) => {
                    console.error("Error al obtener datos de ventas: " + error);
                });
})

