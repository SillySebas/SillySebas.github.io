const languagesBackground = [];
const languagesHtml = ["<img class=\"langImg\" src=\"assets/css.png\" alt=\"CascadingStyleSheets\" title=\"Cascading Style Sheets\">", "<img class=\"langImg\" src=\"assets/html.png\" alt=\"HyperTextMarkupLanguage\" title=\"HyperText Markup Language\">", "<img class=\"langImg\" src=\"assets/js.png\" alt=\"JavaScript\" title=\"Java Script\">", "<img class=\"langImg\" src=\"assets/python.png\" alt=\"Python\" title=\"Python\">","<img class=\"langImg\" src=\"assets/java.png\" alt=\"Java\" title=\"Java\">","<img class=\"langImg\" src=\"assets/cpp.png\" alt=\"CPlusPlus\" title=\"C++\">", "<img class=\"langImg\" src=\"assets/c.png\" alt=\"C\" title=\"C\">"];

const langButtonLeft = document.querySelector("#leftLangButton");
const langButtonRight = document.querySelector("#rightLangButton");

const lang = document.querySelector("#languages");

langButtonLeft.addEventListener('click', function(e)
{
    let firstLang = languagesHtml[0];
    let newHtml = '';

    languagesHtml.shift();
    languagesHtml.push(firstLang);


    for(i in languagesHtml)
    {
        newHtml = `${newHtml}               ${languagesHtml[i]}\n`
    }

    lang.innerHTML = newHtml;
    lang.firstElementChild.remove();
    let children = Array.from(lang.children)

    children.forEach(function(e)
    {
        e.onclick = (ee) => {
            window.location.href = `${e.getAttribute("alt").toLowerCase()}/${e.getAttribute("alt").toLowerCase()}.html`;
        };
    });


    console.log();
    console.log(languagesHtml);
});

langButtonRight.addEventListener('click', function(e)
{
    let firstLang = languagesHtml[0];
    let newHtml = '';

    languagesHtml.push(firstLang);
    languagesHtml.shift();
    
    for(i in languagesHtml)
    {
        newHtml = `${newHtml}               ${languagesHtml[i]}\n`
    }

    lang.innerHTML = newHtml;
    lang.firstElementChild.remove();
    let children = Array.from(lang.children)

    children.forEach(function(e)
    {
        e.onclick = (ee) => {
            window.location.href = `${e.getAttribute("alt").toLowerCase()}/${e.getAttribute("alt").toLowerCase()}.html`;
        };
    });


    console.log();
    console.log(languagesHtml);
});