const stories = [
    'Move your mouse here when you finish reading this line.',
    'Click me if you want to read next story.',
    'You start to drift off into a comfortable sleep when you hear your name being whispered.',
    'You live alone.',   
    'My brother and I sit down with the Ouija board, and we both place our hands on the planchette. He says, "Cole, are you here with me?"',
    'and I move the planchette to "yes."', 
    'When I smiled, he did not smile back. ',
    'Something is very wrong with this mirror.',
];
let currentLineCombo= 0;  //this the N th pair of the lines, so it is half of total lines in array above
let pos=0; //set the vertical position of the button and image

function changeContent(){
    //calculate total stories and set as limit
    let totalStories = stories.length;

    //click to refresh story presented
    //but not exceeds total limits
    if(currentLineCombo*2+2>=totalStories){
        currentLineCombo=1;
    }else{
        currentLineCombo++;
    }

    //console log to check
    console.log(currentLineCombo*2 +"/" + totalStories);

        pos = 12*currentLineCombo-12;
        document.getElementById("buttonContainer").style.padding=pos + "% 0";
        //update displayed content on button
        document.getElementById("textbox").innerHTML = stories[currentLineCombo];
        hideStory();
}


function revealStory(){
    document.getElementById("textbox").innerHTML = stories[currentLineCombo*2+1];
    document.getElementById("bg").style.backgroundImage = "url('./Photo"+(currentLineCombo*2+1)+".PNG')";// url('./Photo1.JPG')
}

function hideStory(){
    document.getElementById("textbox").innerHTML = stories[currentLineCombo*2];
    document.getElementById("bg").style.backgroundImage ="url('./Photo"+currentLineCombo*2+".PNG')";
}
