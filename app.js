document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([47.5, 13.5], 7); // Center Austria
    let percent = 20;
    
    // Define the WFS URL
    const wfsUrl = 'https://geoserver22s.zgis.at/geoserver/IPSDI_WT24/wfs';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const wfsParams = {
      service: 'WFS',
      version: '1.1.0',
      request: 'GetFeature',
      typeName: '',
      outputFormat: 'application/json', // Request GeoJSON format
  };

    const select = document.querySelector('#option');
    fetchData(wfsParams, select.value);

    select.onchange = function() {
      fetchData(wfsParams, this.value);
    };

    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    const doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: ['Male Students', 'Female Students'],
            datasets: [{
            data: [1, 1], // Placeholder data
            backgroundColor: ['#36a2eb', '#ff6384'],
            borderColor: ['#388E3C', '#FFA000'],
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
                labels: {
                color: 'white'
                }
            }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw(chart) {
                const { width } = chart;
                const { height } = chart;
                const ctx = chart.ctx;
    
                ctx.save();
                const fontSize = (height / 100).toFixed(2); // Adjust font size
                ctx.font = `${fontSize}em sans-serif`;
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
    
                const text = percent.toString() + "%"; // Your central text
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 1.8;
    
                ctx.fillText(text, textX, textY);
                ctx.restore();
            }
        }]
    })
    
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ["University 1", "University 2", '3', '4', '5', '6', '7', '8', '9', '10'], // University names (to be updated dynamically)
            datasets: [
            {
                label: 'Male Students',
                data: [80, 55], // Male student counts (to be updated dynamically)
                backgroundColor: '#36a2eb',
                borderColor: '#388E3C',
                borderWidth: 1
            },
            {
                label: 'Female Students',
                data: [20, 45], // Female student counts (to be updated dynamically)
                backgroundColor: '#ff6384',
                borderColor: '#FFA000',
                borderWidth: 1
            }
            ]
        },
        options: {
            responsive: true,
            scales: {
            x: {
                stacked: true // Enable stacked bars on the X-axis
            },
            y: {
                stacked: true, // Enable stacked bars on the Y-axis
                beginAtZero: true
            }
            },
            plugins: {
            legend: {
                position: 'top'
            }
            }
        }
    });
    
    function updateCharts(properties, male, female) {
      
      if (properties == undefined) {
        percent = Math.round(calculatePercent(male, female));
        doughnutChart.data.datasets[0].data = [male, female];
        doughnutChart.plugins
        doughnutChart.update();
        return;
    }
    
    percent = Math.round(calculatePercent(properties.all_studies_m, properties.all_studies_f));
    doughnutChart.data.datasets[0].data = [properties.all_studies_m, properties.all_studies_f];
    doughnutChart.update();

    barChart.data.datasets[0].data = [
      properties.architecture_m, properties.biological_science_m,
      properties.environments_m, properties.manufacturing_and_processing_m,
      properties.natural_methematics_statistics_m, properties.physical_sciences_m,
      properties.software_and_applications_development_m
    ]

    barChart.data.datasets[1].data = [
      properties.architecture_f, properties.biological_science_f,
      properties.environments_f, properties.manufacturing_and_processing_f,
      properties.natural_methematics_statistics_f, properties.physical_sciences_f,
      properties.software_and_applications_development_f
    ]
    barChart.update();
    }
    
    function fetchData(params, typeName){
    
    params.typeName = typeName;
    
    // Make the WFS request and handle the response
    fetch(wfsUrl + '?' + new URLSearchParams(params).toString())
        .then(response => response.json())
        .then(data => {
            // Convert the WFS response (GeoJSON) into a Leaflet layer
            let [male, female] = calculate(data.features);
            console.log(data)
            updateCharts(undefined, male, female);
            document.querySelector("#all").addEventListener("click", () => {
                updateCharts(undefined, male, female);  
            });
    
            const wfsLayer = L.geoJSON(data, {
                onEachFeature: (feature, layer) => {
                layer.on("click", () => {
                    updateCharts(feature.properties);
                })
                }
            })
            
            // Add the layer to the map
            wfsLayer.addTo(map);
            })
            .catch(error => console.error('Error fetching WFS data:', error));
    }
    
    function calculate(object) {
    let male = 0;
    let female = 0;
    
    object.forEach(feature => {
        male += feature.properties.all_studies_m;
        female += feature.properties.all_studies_f;
    });
    
    return [male, female];
    }

    function calculatePercent(male, female) {
          let percent = (female / (female + male)) * 100;
          return percent;
    }
})