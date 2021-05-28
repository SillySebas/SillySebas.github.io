document.querySelectorAll(".heading_button").forEach((button) => {
    button.addEventListener("click", () => {
        if(button.innerHTML != "About")
        {
            if(button.innerHTML.toLowerCase() == "home")
            {
                window.location.href = ("/");
            }
            else
            {
                window.location.href = ("/" + button.innerHTML.toLowerCase());
            }
        }
        
    })
});

console.log(document.querySelectorAll(".heading_button"))

