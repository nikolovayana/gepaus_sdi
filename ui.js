document.addEventListener("DOMContentLoaded", () => {
    const media = document.querySelector(".media-container");
    const doughnut = document.querySelector(".doughnut-container");
    const bar = document.querySelector(".bar-container");

    if (window.innerWidth < 980) {
        media.classList.add("hidden");
    }

    if (window.innerWidth < 540) {
        bar.classList.add("displayed");
        console.log("success");
    }

    window.addEventListener('resize', () => {
        if (screen.width < 980) {
            media.classList.add("hidden");
        }

        if (window.innerWidth < 540) {
            bar.classList.add("displayed");
            console.log("success")
        }

        if (window.innerWidth > 540) {
            bar.classList.remove("displayed");
            doughnut.classList.remove("displayed");
        }
    })

    document.querySelector(".logo").addEventListener("click", () => {
        media.classList.toggle("hidden");
    })

    document.querySelector(".toggle").addEventListener("click", () => {
        doughnut.classList.toggle("displayed");
        bar.classList.toggle("displayed");
    })
})