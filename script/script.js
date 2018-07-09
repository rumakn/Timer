window.onload = init;

var timerTitle;
var btnStart, btnReset;
var btnWork, btnShort, btnLong, btnCustom1, btnCustom2;
var statusSession, statusStart;
var currentTime, startingTime;
var sessionTime, breakTime, breakTimeLong, customTime1, customTime2;
let countdown;
var buttons; 
var modal, closeBtn;

function init() {
    // document queries

    /* widget specific */
    timerTitle =  document.querySelector(".widget-title");
    /* timer */
    timer = document.querySelector("#timer");

    /* controls for current timer */
    
    btnStart =  document.querySelector("#btn-start");
    btnReset =  document.querySelector("#btn-reset");

    /* controls to change timer start times */
    btnWork =  document.querySelector("#btn-work");
    btnShort =  document.querySelector("#btn-short");
    btnLong =  document.querySelector("#btn-long");
    btnCustom1 =  document.querySelector("#btn-cust-1");
    btnCustom2 =  document.querySelector("#btn-cust-2");
    buttonsTime = [btnWork, btnShort, btnLong, btnCustom1, btnCustom2];

    /* modal  */
    modal = document.querySelector("#myModal");
    closeBtn = document.querySelector(".close");

    // times in seconds
    sessionTime = 25 * 60;
    breakTime = 5 * 60 ;

    currentTime = sessionTime;
    startingTime = currentTime;

    // initial status settings 
    statusSession = "Working";
    statusStart = 0;

    buttonListenerSetup()
    
}

function buttonListenerSetup(){
    
    if(btnStart.addEventListener){
        btnStart.addEventListener('click', setStatus);
    }else{
        // internet explorer < 9
        btnStart.attachEvent('onclick', setStatus);
    }
    if(btnReset.addEventListener){
        btnReset.addEventListener('click', resetTimer);
    }else{
        // internet explorer < 9
        btnReset.attachEvent('onclick', resetTimer);
    }

    buttonsTime.forEach(function(element) {
        
        if(element.addEventListener){
            element.addEventListener('click', changeCurrentTime);
        }else{
            // internet explorer < 9
            element.attachEvent('onclick', changeCurrentTime);
        }
     }
    )
}

function closeModal(){
    modal.style.display = "none";
}
function openModal(){
    modal.style.display = "block";


    if(closeBtn.addEventListener){
        closeBtn.addEventListener('click', closeModal);
    }else{
        // internet explorer < 9
        closeBtn.attachEvent('onclick', closeModal);
    }
    
    if(window.addEventListener){
        window.addEventListener('click', () => {
            if(event.target == modal){
                closeModal();
            }
        });
    }else{
        // internet explorer < 9
        window.attachEvent('onclick', () => {
            if(event.target == modal){
                closeModal();
            }
        });
    }
}



function changeCurrentTime(){
    if(this.classList.contains('btn-greyed')){
        return false;
    }
    if(this.innerHTML == " + "){
        openModal();
        return false;
    }
    var seconds = parseInt(this.dataset.time) * 60;
    currentTime = seconds;
    if(statusStart){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
    switchBreak(this);
}


function switchBreak(selectedButton){
    
    if(selectedButton.id == "btn-work"){
        statusSession = "Work";
    }
    else if(selectedButton.id == "btn-short"){
        statusSession = "Short Break";
    }
    else if(selectedButton.id == "btn-long"){
        statusSession = "Long Break";
    }
    else if(selectedButton.id == "btn-cust-1"){
        statusSession = "Custom Timer 1";
    }
    else{
        statusSession = "Custom Timer 2";
    }


   timerTitle.innerHTML = statusSession;
}

function setStatus(){
    if (statusStart){
        statusStart = 0;
        btnStart.innerHTML = "Start";
        timerTitle.innerHTML = "Timer Paused";
        pauseTimer();
        
    }
    else{
        statusStart = 1;
        btnStart.innerHTML = "Pause";
        timerTitle.innerHTML = statusSession;
        startTimer();

    }
}




function timerFunc(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now +(seconds *1000);
    displayTimeFormat(seconds);
    startingTime = currentTime;
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
    
    currentTime = startingTime;
    if(statusStart){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
}

