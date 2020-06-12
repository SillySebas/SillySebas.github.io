const languagesBackground = [];
const languagesHtml = ["<img class=\"langImg\" src=\"assets/css.png\" alt=\"css\" title=\"Cascading Style Sheets\">", "<img class=\"langImg\" src=\"assets/html.png\" alt=\"html\" title=\"html\">", "<img class=\"langImg\" src=\"assets/js.png\" alt=\"JavaScript\" title=\"Java Script\">", "<img class=\"langImg\" src=\"assets/python.png\" alt=\"Python\" title=\"Python\">","<img class=\"langImg\" src=\"assets/java.png\" alt=\"Java\" title=\"Java\">","<img class=\"langImg\" src=\"assets/cpp.png\" alt=\"CPlusPlus\" title=\"C++\">", "<img class=\"langImg\" src=\"assets/c.png\" alt=\"C\" title=\"C\">"];

const langButtonLeft = document.querySelector("#leftLangButton");
const langButtonRight = document.querySelector("#rightLangButton");

const lang = document.querySelector("#languages");

const titleMain = document.querySelector("#title-main");

let children = Array.from(lang.children)

children.forEach(function(e)
{
    e.onclick = (ee) => {
        window.open(`code/${e.getAttribute("alt").toLowerCase()}/`, '_blank');
    };
});

document.querySelector('#showcase').onclick = (ee) => {
    window.open(`code/`, '_blank');
};

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
            window.location.href = `code/${e.getAttribute("alt").toLowerCase()}/`;
        };
    });


    console.log();
    console.log(languagesHtml);
});

langButtonRight.addEventListener('click', function(e)
{
    let lastLang = languagesHtml.pop();
    let newHtml = '';

    languagesHtml.unshift(lastLang)
    
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
            window.location.href = `code/${e.getAttribute("alt").toLowerCase()}/`;
        };
    });


    console.log();
    console.log(languagesHtml);
});

let interval = "",interval2;

titleMain.addEventListener('mouseover', function(e)
{
    let texts = ['Sebastian Peacock','S ebastian Peacock','S e bastian Peacock','S e b astian Peacock','S e b a stian Peacock','S e b a s tian Peacock','S e b a s t ian Peacock','S e b a s t i an Peacock','S e b a s t i a n Peacock','S e b a s t i a n  P eacock','S e b a s t i a n  P e acock','S e b a s t i a n  P e a cock','S e b a s t i a n  P e a c ock','S e b a s t i a n  P e a c o ck','S e b a s t i a n  P e a c o c <a id="secretLink" href="/secret/">k</a>'], i = 0;

    function changeText() 
    {
        document.querySelector("#title-main").innerHTML = texts[i];

        if(i < texts.length - 1) 
        {
            i++;
        }
        
        else
        {
            clearInterval(interval);
            
            interval2 = setInterval(function() 
            {
                document.querySelector("#title-main").innerHTML = texts[0]
                clearInterval(interval2)
                interval = "";
            }, 1000);
        } 
    }
    if(interval === "")
    {
        interval = setInterval(changeText, 100);
    }
    
});