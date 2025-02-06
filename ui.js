document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const media = document.querySelector(".media-container");
    if (window.innerHeight < 615) {
        toggleNavbar();
    }
    window.addEventListener('resize', () => {
        if (window.innerHeight < 615) {
            navbar.style.opacity = "0";
            toggleNavbar();
        }
        else {
            navbar.style.opacity = "1";
        }

        if (screen.width < 980) {
            media.classList.add("hidden");
        }
    })

    if (window.innerWidth < 980) {
        media.classList.add("hidden");
    }

    document.querySelector(".logo").addEventListener("click", () => {
        media.classList.toggle("hidden");

    })

    function toggleNavbar() {
        navbar.addEventListener("mouseenter", () => {
            document.querySelector(".navbar").style.opacity = "1";
        })
        navbar.addEventListener("mouseleave", () => {
            navbar.style.opacity = "0";          
        })
    }
})