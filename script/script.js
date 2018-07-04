window.onload = init;

var timerTitle;
var btnBreak, btnPlay, btnReset;
var statusSession, statusPlay;
var currentTime;
var sessionTime, breakTime;
let countdown;

function init() {
    

    timerTitle =  document.querySelector(".widget-title");

    timer = document.querySelector("#timer");

    btnBreak =  document.querySelector("#btn-break");
    btnPlay =  document.querySelector("#btn-play");
    btnReset =  document.querySelector("#btn-reset");

    // times in seconds
    sessionTime = 25 * 60;
    breakTime = 5 * 60 ;

    currentTime = sessionTime;

    // initial status settings 
    statusSession = "Working";
    statusPlay = 0;

    // Event listener for changing between session and break
    if(btnBreak.addEventListener){
        btnBreak.addEventListener('click', switchBreak)
    }else{
        btnBreak.attachEvent('onclick', switchBreak)
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
}


function switchBreak(){
   if (statusSession == "Working"){
    statusSession = "Taking Break";
    btnBreak.innerHTML = "Start Work";
    currentTime = breakTime;
    startTimer();
       
   }
   else{
        statusSession = "Working";
       btnBreak.innerHTML = "Start Break"
      currentTime = sessionTime;
      startTimer();
   }
   timerTitle.innerHTML = statusSession;
}

function setPlaying(){
    if (statusPlay){
        statusPlay = 0;
        btnPlay.innerHTML = "Play";
        timerTitle.innerHTML = "Timer Paused";
        pauseTimer();
        
    }
    else{
        statusPlay = 1;
        btnPlay.innerHTML = "Pause";
        timerTitle.innerHTML = statusSession;
        startTimer();

    }
}




function timerFunc(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now +(seconds *1000);
    displayTimeFormat(seconds);

    countdown = setInterval( () => {
       const secondsLeft = Math.round((then - Date.now() ) / 1000);

        if(secondsLeft < 0){
            clearInterval(countdown);
            return;
        }

        displayTimeFormat(secondsLeft);
    },1000);
}

function displayTimeFormat(seconds){
    currentTime = seconds;
    const minutes = Math.floor ( seconds / 60 );
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timer.textContent =  display;
    document.title = display;
}

function startTimer(){
    timerFunc(currentTime);
}

function pauseTimer(){
    clearInterval(countdown);
}



function resetTimer(){
    
    currentTime = sessionTime;
    if(statusPlay){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
}