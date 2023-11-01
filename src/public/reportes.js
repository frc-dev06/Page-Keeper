const form= document.querySelector('#reportForm');
let tipo= form.elements.reportType.value;

function crearGrafico(datos) {

    const ctx = document.getElementById('myChart').getContext('2d');

    
    const existingChart = window.myChart;

    if (existingChart) {
       
        if (existingChart instanceof Chart) {
            existingChart.destroy();
        }
    }

    window.myChart = new Chart(ctx, {
        type: tipo, 
        data: datos,
    });
}

const misDatos = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
        label: 'Ventas',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

form.addEventListener('change', function() {
    tipo = form.elements.reportType.value;
    crearGrafico(misDatos);
});
