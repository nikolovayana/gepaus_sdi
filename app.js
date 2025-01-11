document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([47.5, 14.5], 7); // Center Austria
    
    // Define the WFS URL
    const wfsUrl = 'https://geoserver22s.zgis.at/geoserver/IPSDI_WT24/wfs';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // Set the WFS request parameters
    const wfsParams = {
        service: 'WFS',
        version: '1.1.0',
        request: 'GetFeature',
        typeName: 'IPSDI_WT24:sem_w_2013_2014_wfs',
        outputFormat: 'application/json', // Request GeoJSON format
    };

    // Make the WFS request and handle the response
    fetch(wfsUrl + '?' + new URLSearchParams(wfsParams).toString())
        .then(response => response.json())
        .then(data => {
            // Convert the WFS response (GeoJSON) into a Leaflet layer
            const wfsLayer = L.geoJSON(data);
            
            // Add the layer to the map
            wfsLayer.addTo(map);
        })
        .catch(error => console.error('Error fetching WFS data:', error));



    
    
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
              position: 'top'
            }
          }
        }
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
})