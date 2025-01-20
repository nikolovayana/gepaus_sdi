document.addEventListener("DOMContentLoaded", () => {
    console.log('waiting')
    console.log(window.innerHeight)
    if (window.innerHeight < 615) {
        document.querySelector(".arrow").addEventListener("mouseover", () => {
            console.log("success")
            document.querySelector(".navbar").style.display = "flex";
        })
    }
})