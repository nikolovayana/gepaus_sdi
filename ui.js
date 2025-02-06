document.addEventListener("DOMContentLoaded", () => {
    const media = document.querySelector(".media-container");
    const doughnut = document.querySelector(".doughnut-container");
    const bar = document.querySelector(".bar-container");

    if (window.innerWidth < 980) {
        media.classList.add("hidden");
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth < 980) {
            media.classList.add("hidden");
        }

        if (window.innerWidth < 540) {
            bar.style.display = 'none';
        }

        if (window.innerWidth > 540) {
            bar.style.display = 'block';
            doughnut.style.display = 'block';
        }
    })

    document.querySelector(".logo").addEventListener("click", () => {
        media.classList.toggle("hidden");
    })

    document.querySelector(".toggle").addEventListener("click", () => {
        if (bar.style.display === 'none') {
            bar.style.display = "block";
            doughnut.style.display = 'none';
        } else {
            bar.style.display = 'none';
            doughnut.style.display = 'block';
        }
    })
})