const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateButton= document.querySelector(".generateButton");
const allcheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols="~`!@#$%^&*()_+}{|<>:?,./;'[]\=-'";

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");
//set circle indicator to gray


function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength -min)*100/(max-min) )+ "%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min ,max){
    return Math.floor(Math.random() * (max-min)) +min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    let i=generateRandomNumber(0,symbols.length);
    return symbols[i];
}

function calcStrength(){
    let hasLower=false;
    let hasUpper=false;
    let hasNumber=false;
    let hasSymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;


    if(password.length>10 && hasUpper && hasLower && (hasNumber || hasSymbol)){
        setIndicator("#0f0");
    }
    else if(passwordLength>7 && (hasUpper || hasLower) && (hasSymbol || hasNumber)){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckboxChange(){
    checkCount=0;
    allcheckBox.forEach((checkBox)=>{
        if(checkBox.checked) checkCount++;
    });

    if(checkCount>passwordLength){
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach( (checkBox)=>{
    checkBox.addEventListener('change',handleCheckboxChange);
});

generateButton.addEventListener('click', ()=>{
    if(checkCount<=0) return;

    if(checkCount>passwordLength){
        passwordLength=checkCount;
        handleSlider();
    }

    password="";

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }

    password= shufflePassword(Array.from(password));

    passwordDisplay.value=password;

    calcStrength();
});

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp= array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach( (el)=> {
        str+=el;
    });
    return str;
}

