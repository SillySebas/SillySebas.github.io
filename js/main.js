document.querySelectorAll(".heading_button").forEach((button) => {
    button.addEventListener("click", () => {
        window.location.href = ("/" + button.getAttribute("link"));
    })
});

let half_css = document.styleSheets[1];
let full_css = document.styleSheets[0];

let max_body_width = window.outerWidth;

document.body.onresize = () =>{
    if(document.body.clientWidth <= max_body_width/2)
    { 
        half_css.disabled = false;
    }
    else
    {      
        half_css.disabled = true;
    }

    if(window.outerWidth > max_body_width)
    {
        max_body_width = window.outerWidth;
    }
};

half_css.disabled = true;