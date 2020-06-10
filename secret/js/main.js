const keyCode = [];
const keyCard = [5,4,3,9,8,6,1,2,5,1,1,1,1];


function keyToString(code)
{   
    let r = "Input";
    if(code.length > 0)
    {
        r = "";
    }
    for(let i in code)
        {
            r = r.concat(`${code[i]}`);

        }

    
    document.querySelector("#keyCode-h1").innerHTML = `${r}`;
    return r;
}

function keyPadLogic(code)
{
    console.log(code);

    if(keyToString(code) == keyToString(keyCard))
    {
        console.log("Access Granted");
        let inter = setInterval(function() {
            document.querySelector(`#done`).play();
            clearInterval(inter);
        }, 5000);
        
    }
    else
    {
    for(let i = 0; i < code.length; i++)
    {
        if (code[i] === 1)
        {
            console.log(code[i]+'=1:1');
            if (code[i+1] === 1)
            {
                console.log(code[i+1]+'=1:2');
                if (code[i+2] === 1)
                {
                    console.log(code[i+2]+'=1:3');
                    if (code[i+3] === 1)
                    {
                        console.log(code[i+3]+'=1:4');
                        keyCode.length = 0;
                    }     
                }                
            }
        }
    keyToString(code);
    }
    }
    

}

function keyPadClick(num)
{
    if(num === 0)
    {
        document.querySelector(`#soundVib`).play();
    }
    else
    {
        document.querySelector(`#sound${num}`).play();
    }
    
    console.log(num+" Clicked");
    keyCode.push(num);

    keyPadLogic(keyCode);
    console.log(keyCode);
}