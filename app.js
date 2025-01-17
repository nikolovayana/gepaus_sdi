document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([47.5, 13.5], 7); // Center Austria
    let percent = 0;
    let memeIndex = 0;
    
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
    const uni = document.querySelector('#university');
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
                position: 'bottom',
                labels: {
                    color: 'white',
                }
                // display: false
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
    
                const text = percent + "%"; // Your central text
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2.5;
    
                ctx.fillText(text, textX, textY);
                ctx.restore();
            }
        }]
    })
    
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ["Architecture", "Biological science", 'Environment', 'Manufacturing', 'Mathematics', 'Physical science', 'Software development'],
            datasets: [
            {
                label: 'Male Students',
                data: [80, 55], // Male student counts (to be updated dynamically)
                backgroundColor: '#36a2eb',
                borderColor: '#388E3C',
                borderWidth: 1,
                barThickness: 15
            },
            {
                label: 'Female Students',
                data: [20, 45], // Female student counts (to be updated dynamically)
                backgroundColor: '#ff6384',
                borderColor: '#FFA000',
                borderWidth: 1,
                barThickness: 15
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
                position: 'bottom',
                display: false
            }
            }
        }
    });
    
    function updateCharts(properties, male, female) {
      
      if (properties == undefined) {
        countTo(Math.round(calculatePercent(male, female)), all=true);
        doughnutChart.data.datasets[0].data = [male, female];
        doughnutChart.plugins
        doughnutChart.update();
        getNextMeme();
        return;
    }
    
    countTo(Math.round(calculatePercent(properties.all_studies_m, properties.all_studies_f)));
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
    getNextMeme();
    }
    
    function fetchData(params, typeName){
    
    params.typeName = typeName;
    
    // Make the WFS request and handle the response
    fetch(wfsUrl + '?' + new URLSearchParams(params).toString())
        .then(response => response.json())
        .then(data => {
            
            let [male, female] = calculate(data.features);
            console.log(data)
            
            updateCharts(undefined, male, female);
            
            data.features.forEach((feature, index) => {
                const option = document.createElement("option");
                option.innerHTML = feature.properties.university.toString();
                option.value = index;
                uni.appendChild(option);
            })

            uni.onchange = function() {
                if (this.value === 'none') {
                    updateCharts(undefined, male, female);
                    return;
                }
                updateCharts(data.features[this.value].properties, undefined, undefined);
            }

            document.querySelector("#all").addEventListener("click", () => {
                updateCharts(undefined, male, female);  
            });
    
            const wfsLayer = L.geoJSON(data, {
                onEachFeature: (feature, layer) => {
                
                    layer.on("click", () => {
                        updateCharts(feature.properties);
                    });

                    layer.on("mouseover", (e) => {
                        layer.bindPopup(feature.properties.university).openPopup();
                        })

                    layer.on("mouseout", () => {
                        layer.bindPopup(feature.properties.university).closePopup();
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
        if (male === 0 || female === 0) {
            return 0;
        }
        let percent = (female / (female + male)) * 100;
        return percent;
    }

    function countTo(number, all=false) {
        clearInterval(this.id);
        if (percent === "no data") {
            percent = 0;
        }

        if (number === 0) {
            percent = "no data"
        }


        this.id = setInterval(function () {
            if (number > percent) {
                percent += 1;
            }
            else if (number < percent) {
                percent -= 1;
            }

            if (percent === number) {
                clearInterval(this.id);
                console.log(percent)
                console.log(number)
            }

        }, 20)
    }

    function getNextMeme() {
        let meme = document.querySelector("#meme");
        let half1 = meme.getAttribute("src").split("/")[0];
        let number = Math.floor(Math.random() * 25);
        if (number === memeIndex) {
          number++;
        }
        meme.setAttribute("src", half1 + '/' + number.toString() + "_image.jpg");
        memeIndex = number;

        let number2 = Math.floor(Math.random() * 3); 
    }
})