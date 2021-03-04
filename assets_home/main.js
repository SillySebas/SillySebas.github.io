document.querySelectorAll(".heading_button").forEach((button) => {
    button.addEventListener("click", () => {
        if(button.innerHTML != "Home")
        {
            window.location.href = ("/" + button.innerHTML.toLowerCase());
        }
        
    })
});

console.log(document.querySelectorAll(".heading_button"))

