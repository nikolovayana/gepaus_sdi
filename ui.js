document.addEventListener("DOMContentLoaded", () => {
    if (window.innerHeight < 615) {
        document.querySelector(".navbar").style.display = "none";
        document.querySelector(".arrow").addEventListener("mouseover", () => {
            console.log("success")
            document.querySelector(".navbar").style.display = "flex";
        })
        document.querySelector(".navbar").addEventListener("mouseout", () => {
            console.log("success")
            document.querySelector(".navbar").style.display = "none";
        })
    }
    window.addEventListener('resize', (event) => {
        console.log(event.type)
        if (window.innerHeight < 615) {
            document.querySelector(".navbar").style.display = "none";
            document.querySelector(".arrow").addEventListener("mouseover", () => {
                console.log("success")
                document.querySelector(".navbar").style.display = "flex";
            })
            document.querySelector(".navbar").addEventListener("mouseout", () => {
                console.log("success")
                document.querySelector(".navbar").style.display = "none";
            })
        }
        else {
            document.querySelector(".navbar").style.display = "flex";
        }

    })
    })