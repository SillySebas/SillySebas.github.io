document.querySelectorAll(".heading_button").forEach((button) => {
    button.addEventListener("click", () => {
        window.location.href = ("/" + button.getAttribute("link"));
    })
});

let half_css = document.styleSheets[1];
let full_css = document.styleSheets[0];

let max_body_width = window.outerWidth;

let heading_nav_list = document.querySelector(".heading_nav_list")
let heading_nav_static_container = document.querySelector(".heading_nav_static_container")

heading_nav_static_container.style.display = "none";

let should_display_top_nav = false;

var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

document.body.onresize = () =>{
    if((document.body.clientWidth <= max_body_width/2) || (window.innerWidth < innerHeight))
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

document.addEventListener("scroll", (click)=>{
    if(!isInViewport(heading_nav_list) && !should_display_top_nav)
    {
        should_display_top_nav = true;
        heading_nav_static_container.style.display = "";
    }
    else if(isInViewport(heading_nav_list) && should_display_top_nav){
        should_display_top_nav = false;
        heading_nav_static_container.style.display = "none";
    }
})

half_css.disabled = true;

document.body.onresize();