window.onload = init;


var btnStart, btnReset;
var btnWork, btnShort, btnLong, btnCustom1, btnCustom2, buttons;

var timerTitle;
var statusSession, statusStart; /* start/play button status and type of timer */
var currentTime, startingTime; /* hold current time and starting time for reset */
let countdown; /* holds the interval timer */
var modal, closeBtn, btnModalSave, btnModalReset, btnModalCancel;
var modalTime, modalTag, modaldefault, modalSound, modalVolume;
var Timers;


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
    /* modal buttons */
    btnModalSave = document.querySelector("#btn-modal-save");
    btnModalReset = document.querySelector("#btn-modal-reset");
    btnModalCancel = document.querySelector("#btn-modal-cancel");

    /* modal input */
    modalTime = document.querySelector("#modalTime");
    modalTag = document.querySelector("modalTag");
    modaldefault = document.querySelector("modalDefault");
    modalSound = document.querySelector("modalSound");
    modalVolume = document.querySelector("modalVolume");

    initTimers();


   

    currentTime = Timers[0].time * 60;
    startingTime = currentTime;

    // initial status settings 
    statusSession = 0; /* value of selected timer, same is Timers index*/
    statusStart = false; /* whether timer is paused or started */

    buttonListenerSetup()
    
}

function initTimers(){
    Timers = [
        {
            name: "Work",
            time: 25,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            name: "Short Break",
            time: 5,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            name: "Long Break",
            time: 15,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            name: "Custom Timer 1",
            time: 25,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            name: "Custom Timer 2",
            time: 25,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        }
    ]
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

    if(btnModalSave.addEventListener){
        btnModalSave.addEventListener('click', saveCustom);
    }else{
        // internet explorer < 9
        btnModalSave.attachEvent('onclick', saveCustom);
    }
    if(btnModalReset.addEventListener){
        btnModalReset.addEventListener('click', resetModal);
    }else{
        // internet explorer < 9
        btnModalReset.attachEvent('onclick', resetModal);
    }
    if(btnModalCancel.addEventListener){
        btnModalCancel.addEventListener('click', closeModal);
    }else{
        // internet explorer < 9
        btnModalCancel.attachEvent('onclick', closeModal);
    }
}

function saveCustom(){
    // check form is filled


    // get the filled in form values
    // if custom 1 button 
    // fill custom 1 values 
    // change custom 1 button values 
    // un disable second custom

    // if custom 2
    // fill custom 2 values
    // change button 
    closeModal();
}
function resetModal(){
    // set back to default when opened
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
        statusSession = 0;
    }
    else if(selectedButton.id == "btn-short"){
        statusSession = 1;
    }
    else if(selectedButton.id == "btn-long"){
        statusSession = 2;
    }
    else if(selectedButton.id == "btn-cust-1"){
        statusSession = 3;
    }
    else{
        statusSession = 4;
    }


   timerTitle.innerHTML = Timers[statusSession].name;
}

function setStatus(){
    if (statusStart){
        statusStart = false;
        btnStart.innerHTML = "Start";
        timerTitle.innerHTML = "Timer Paused";
        pauseTimer();
        
    }
    else{
        statusStart = true;
        btnStart.innerHTML = "Pause";
        timerTitle.innerHTML = Timers[statusSession].name;
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

