document.addEventListener("DOMContentLoaded", () => {
    const media = document.querySelector(".media-container");
    const doughnut = document.querySelector(".doughnut-container");
    const bar = document.querySelector(".bar-container");

    if (window.innerWidth < 980) {
        media.classList.add("hidden");
    }

    if (window.innerWidth < 670) {
        bar.style.display = "none";
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth < 980) {
            media.classList.add("hidden");
        }

        if (window.innerWidth < 670) {
            bar.style.display = 'none';
        }

        if (window.innerWidth > 670) {
            bar.style.display = 'block';
            doughnut.style.display = 'block';
        }
    })

    document.querySelector(".menu").addEventListener("click", () => {
        media.classList.toggle("hidden");
    })

    document.querySelector(".toggle").addEventListener("change", () => {
        if (bar.style.display === 'none') {
            bar.style.display = "block";
            doughnut.style.display = 'none';
            console.log("executed")
        } else {
            bar.style.display = 'none';
            doughnut.style.display = 'block';
        }
    })
})