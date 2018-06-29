window.onload = init;

var timerTitle;
var btnBreak, btnPlay, btnReset;
var statusSession, statusPlay;
var currentTime;
var sessionTime, breakTime;
var timerFunc;

function init() {
    

    timerTitle =  document.querySelector(".widget-title");

    timer = document.querySelector("#timer");

    btnBreak =  document.querySelector("#btn-break");
    btnPlay =  document.querySelector("#btn-play");
    btnReset =  document.querySelector("#btn-reset");

    sessionTime = 25;
    breakTime = 5;

    currentTime = sessionTime;

    // initial status settings 
    statusSession = "Session";
    statusPlay = 0;

    // Event listener for changing between session and break
    if(btnBreak.addEventListener){
        btnBreak.addEventListener('click', SwitchBreak)
    }else{
        btnBreak.attachEvent('onclick', SwitchBreak)
    }

    // Event listener for starting timer
    if(btnPlay.addEventListener){
        btnPlay.addEventListener('click', setPlaying)
    }else{
        btnPlay.attachEvent('onclick', setPlaying)
    }

    // Event listener for starting timer
    if(btnReset.addEventListener){
        btnReset.addEventListener('click', resetTimer)
    }else{
        btnReset.attachEvent('onclick', resetTimer)
    }


    timerFunc = setInterval(myTime, 1000);
}

function SwitchBreak(){
   if (statusSession == "Session"){
        statusSession = "Break";
       btnBreak.innerHTML = "Start Session";
       
       
   }
   else{
        statusSession = "Session";
       btnBreak.innerHTML = "Start Break"
      
   }
   timerTitle.innerHTML = statusSession;
}

function setPlaying(){
    if (statusPlay){
        statusPlay = 0;
        btnPlay.innerHTML = "Play";
        stopTimer();
    }
    else{
        statusPlay = 1;
        btnPlay.innerHTML = "Stop";
        startTimer();
    }
}


function myTime(){
    
    
}

function startTimer(){

}

function stopTimer(){

}

function resetTimer(){

}