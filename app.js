document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([47.5, 13.5], 6); // Center Austria
    let percent = 0; // Will contain the female percentage
    let memeIndex = 0; // Will contain the last meme displayed
    let clickedLayer; // Will contain the point which is clicked on the map
    let isOptionsCreated = false; // Ensures that the select options will be created only once
    const select = document.querySelector('#option'); // Semesters dropdown
    const uni = document.querySelector('#university'); // Universities dropdown
    const postElement = document.querySelector(".text"); // Posts placeholder
    
    // Define the WFS URL
    const wfsUrl = 'https://geoserver22s.zgis.at/geoserver/IPSDI_WT24/wfs';
    
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19
        // }).addTo(map);
        
    // Add the base layer of the map    
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ext: 'png'
    }).addTo(map);

    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    //   attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    //   minZoom: 0,
    //   maxZoom: 19,
    //   ext: 'png'
    // }).addTo(map);
    
    // Define the WFS url parameters
    const wfsParams = {
        service: 'WFS',
        version: '1.1.0',
        request: 'GetFeature',
        typeName: '',
        outputFormat: 'application/json', // Request GeoJSON format
    };
    
    fetchData(wfsParams, select.value);
    
    select.onchange = function() {
        if (clickedLayer) {
            clickedLayer.closePopup();
            clickedLayer = undefined;
        }
        uni.value = "none";
        fetchData(wfsParams, this.value);
    };

    map.on("click", () => {
        if (clickedLayer) {
            clickedLayer = undefined;
            uni.value = "none";
            fetchData(wfsParams, select.value);
        }
    })

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
                ctx.fillStyle = "#ff6384";
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
            labels: ["Architecture", "Biological science", 'Environment', 'Manufacturing', 'Mathematics', 'Physical science', 'Software dev.'],
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
      
        if (male != undefined) {
            countTo(Math.round(calculatePercent(male, female)), all=true);
            doughnutChart.data.datasets[0].data = [male, female];
            doughnutChart.plugins
            doughnutChart.update();
        }
        else {
            countTo(Math.round(calculatePercent(properties.all_studies_m, properties.all_studies_f)));
            doughnutChart.data.datasets[0].data = [properties.all_studies_m, properties.all_studies_f];
            doughnutChart.update();
        }
        

        barChart.data.datasets[0].data = [
        properties.architecture_m, properties.biological_sciences_m,
        properties.environment_m, properties.manufacturing_and_processing_m,
        properties.natural_methematics_statistics_m, properties.physical_sciences_m,
        properties.software_and_applications_development_m
        ]

        barChart.data.datasets[1].data = [
        properties.architecture_f, properties.biological_sciences_f,
        properties.environment_f, properties.manufacturing_and_processing_f,
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
                
                let [male, female, students] = calculate(data.features);
                
                updateCharts(students, male, female);

                if (!isOptionsCreated) {
                    isOptionsCreated = true;
                    data.features.forEach((feature, index) => {
                        const option = document.createElement("option");
                        option.innerHTML = feature.properties.university;
                        option.value = index.toString();
                        uni.appendChild(option);
                    })
                }                

                document.querySelector("#all").addEventListener("click", (event) => {
                    event.preventDefault();
                    uni.value = "none";
                    if (clickedLayer) {
                        clickedLayer.closePopup();
                        clickedLayer = undefined;
                    }  
                    updateCharts(students, male, female);
                });
        
                const wfsLayer = L.geoJSON(data, {
                    onEachFeature: (feature, layer) => {

                        layer.bindPopup(feature.properties.university, options={autoClose: false});
                    
                        layer.on("click", () => {
                            
                            let option = Array.from(uni.options).find(option => option.text === feature.properties.university)
                            if (option) {
                                uni.value = option.value;
                            }
                            layer.openPopup();
                            if (clickedLayer) {
                                clickedLayer.closePopup();
                            }
                            clickedLayer = layer;
                            updateCharts(feature.properties);
                        });

                        layer.on("mouseover", () => {
                            layer.openPopup();
                            })

                        layer.on("mouseout", () => {
                            if (clickedLayer != layer) {
                                layer.closePopup();
                            }
                        })
                    }
                })

                uni.onchange = function() {
                    if (this.value === 'none') {
                        updateCharts(undefined, male, female);
                        if (clickedLayer) {
                            clickedLayer.closePopup();
                            clickedLayer = undefined;
                        }
                        return;
                    }
                    updateCharts(data.features[Number(this.value)].properties, undefined, undefined);
                    const layers = wfsLayer.getLayers();
                    layers[Number(this.value)].openPopup();
                    if (clickedLayer) {
                        clickedLayer.closePopup();
                    }
                    clickedLayer = layers[Number(this.value)];
                }
                
                // Add the layer to the map
                wfsLayer.addTo(map);
                })
                .catch(error => console.error('Error fetching WFS data:', error));
    }
    
    function calculate(object) {
    let male = 0;
    let female = 0;
    const students = {
        architecture_f: 0,
        architecture_m: 0,
        biological_sciences_f: 0,
        biological_sciences_m: 0,
        environment_f: 0,
        environment_m: 0,
        manufacturing_and_processing_f: 0,
        manufacturing_and_processing_m: 0,
        natural_methematics_statistics_f: 0,
        natural_methematics_statistics_m: 0,
        physical_sciences_f: 0,
        physical_sciences_m: 0,
        software_and_applications_development_f: 0,
        software_and_applications_development_m: 0
    }
    
    object.forEach(feature => {
        male += feature.properties.all_studies_m;
        female += feature.properties.all_studies_f;

        Object.keys(students).forEach(key => {
            students[key] += feature.properties[key];
        })
    })

    return [male, female, students];
    }

    function calculatePercent(male, female) {
        if (male === 0 || female === 0) {
            getNextPost(0, uni, postElement);
            return 0;
        }
        let percent = (female / (female + male)) * 100;
        getNextPost(Math.round(percent), uni, postElement);
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
            }

        }, 20)
    }

    function getNextMeme() {
        let meme = document.querySelector("#meme");
        let half1 = meme.getAttribute("src").split("/")[0];
        let number = Math.floor(Math.random() * 22);
        if (number === memeIndex) {
          number++;
        }

        meme.setAttribute("src", half1 + '/' + number.toString() + "_image.jpg");
        memeIndex = number;
    }
})