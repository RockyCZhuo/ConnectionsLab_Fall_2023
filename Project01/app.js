console.log("Page is loading");
let bt00, bt01, bt02, bt03;
let correctButtonNum = -1;
let score = 0;
let correctIndex = 1;
let correctName = "Rocky";
let maxIndex = 809;  //max index in pokedex
let options = ["a", "b", "c", "d"];  //default displayed options 
let indexArray = [];
let wrongOptionsCounter = 0;
let img;
let currentImg;
let p5Canva,extraCanvas;
let thresholdValue = 1.0;
let isReveal = false;
let gif;

window.addEventListener('load', function () {
    //fill the index array, will be used for later random seletion function
    for (let i = 1; i <= 809; i++) {
        indexArray[i - 1] = i;
    }
    console.log('page is Ready to go!');
    getRandomPokemonInfo();
    bt00 = document.getElementById("option_00");
    bt01 = document.getElementById("option_01");
    bt02 = document.getElementById("option_02");
    bt03 = document.getElementById("option_03");
});


function check00() {
    checkAnswer(0);
}
function check01() {
    checkAnswer(1);
} function check02() {
    checkAnswer(2);
} function check03() {
    checkAnswer(3);
}
//rewrite anonymous function - fat arrow syntax
//    function(a){
//        return a+10;
//    }
//1. remove the word function, replace with arrow =>
//(a) => {
//    return a+10;
//}
//2. remove the brackets if there is only one argument
//a => return a+10;
//3. remove 'return' if that's the only thing happening in the function
//a => a+10;



//get random index in 0~Range
function getRandomIndex(range) {
    let result = Math.ceil(Math.random() * (range));
    return result;
}


function getRandomPokemonInfo() {

    //random index generated 1~809
    correctIndex = getRandomIndex(maxIndex - 1) + 1;

    //fetch pkm name and picture based on ID
    fetch('https://pokeapi.co/api/v2/pokemon/' + correctIndex)
        .then(response => response.json())
        .then(function (data) {  //if you get data back
            //set image on webpage
            setPKMimg(correctIndex, data, "page_img");
            options[0] = capitalizeFirstLetter(data.name);
            correctName = options[0];
            refreshOptions(data);
        })
        .catch(error => {
            console.log("Error:" + error)
        });

}

function fetchWrongPKMName(queryIndex, optionk) {
    fetch('https://pokeapi.co/api/v2/pokemon/' + queryIndex)
        .then(response => response.json())
        .then(function (data) {  //if you get data back
            options[optionk + 1] = capitalizeFirstLetter(data.name);
            wrongOptionsCounter++;
            if (wrongOptionsCounter == 3) {
                showOptions();
                descDisplay("Pick the right name!");
                bt00.addEventListener("click", check00);
                bt01.addEventListener("click", check01);
                bt02.addEventListener("click", check02);
                bt03.addEventListener("click", check03);
                descDisplay("Pick the right name!");
            }
        })
        .catch(error => {
            console.log("Error:" + error)
        });
}

//to make name's first letter uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setPKMimg(pkmIndex, data, eleID) {
    let pkmImgElement = document.getElementById(eleID);
    //pkmImgElement.src = data.sprites.front_default;
    loadImage(data.sprites.front_default, img => {
        thresholdValue = 1;
        currentImg = img;
        //console.log(img);
        //currentImg.filter(THRESHOLD,1);
        p5Canvas.clear();
        //image(currentImg, 0, 0,192,192);
        pkmImgElement.src = data.sprites.front_default;
    });
    console.log(currentImg);
}


//select 3 more different pkm names as false options
//within range of total pkm, should be random and not repeated
function refreshOptions(data) {
    let tempArr = indexArray;
    let tempArrIndex;

    //1. Remove the correct answer index from temp array
    tempArrIndex = tempArr.indexOf(correctIndex);
    //console.log(tempArrIndex,correctIndex,tempArr.splice(tempArrIndex,1));

    //2. Pick 3 other random answers
    let i, j, k;
    for (k = 0; k < 3; k++) {
        tempArr.splice(tempArrIndex, 1);
        j = getRandomIndex(tempArr.length - 1);
        fetchWrongPKMName(tempArr[j], k);
        tempArrIndex = j;
    }
}


//place correct answer to a random position
function showOptions() {
    console.log(options);
    let randomPos = Math.floor(Math.random() * 4);
    correctButtonNum = randomPos;
    arraymove(options, 0, randomPos);
    console.log(options);
    for (let i = 0; i < 4; i++) {
        document.getElementById("option_0" + i).innerHTML = options[i];
    }
}



function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}



function checkAnswer(btNum) {
    if (btNum == correctButtonNum) {
        onCorrect();
        descDisplay("Congratulations!!! This is " + correctName + "!!!");
        wrongOptionsCounter = 0;
        bt00.removeEventListener("click", check00);
        bt01.removeEventListener("click", check01);
        bt02.removeEventListener("click", check02);
        bt03.removeEventListener("click", check03);
        console.log("Congratulations!!! This is " + correctName + "!!!");
        score++;
        beginReveal();

    } else {
        descDisplay("Sorry, the answer is " + correctName + "!");
        console.log("Sorry, the answer is " + correctName + "!");
        wrongOptionsCounter = 0;
        bt00.removeEventListener("click", check00);
        bt01.removeEventListener("click", check01);
        bt02.removeEventListener("click", check02);
        bt03.removeEventListener("click", check03);
        beginReveal();
        //getRandomPokemonInfo();
    }
    let output = "Score: " + score;
    document.getElementById("page_score").innerHTML = output;
}


function descDisplay(msg) {
    document.getElementById("page_desc").innerHTML = msg;
}

//——————————————P5 js————————————————————

function preload(){
    gif = loadImage("./SoundFile/d.gif");
}

function setup() {
    p5Canvas = createCanvas(192, 192);
    p5Canvas.parent('page_imgSection');
    //extraCanvas= createGraphics(192,192);
    //extraCanvas.clear();
}

function beginReveal() {
    isReveal = true;
}

function draw() {
    p5Canvas.clear();
    if (currentImg) {
        image(currentImg, 0, 0, 192, 192);
        if (isReveal == true) {
            thresholdValue -= (1 / 180);
            tint(255, (1 - thresholdValue) * 255);
            if (thresholdValue <= 0) {
                isReveal = false;
                enterNext();
            }
        } else if (isReveal == false) {

            filter(THRESHOLD, thresholdValue);
        }
    }
}


function enterNext() {
    isReveal = false;
    getRandomPokemonInfo();
    removeGif();
}

function onCorrect(){
    console.log("Correct!")
    //show gif
    document.getElementById("page_dfruit").src ="./SoundFile/d.gif" ;
}

function removeGif(){
    document.getElementById("page_dfruit").src ="" ;
}
