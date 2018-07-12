window.onload = init;


var btnStart, btnReset;
var btnWork, btnShort, btnLong, btnCustom1, btnCustom2, buttons;

var timerTitle;
var statusSession, statusStart; /* start/play button status and type of timer */
var currentTime, startingTime; /* hold current time and starting time for reset */
let countdown; /* holds the interval timer */
var modal, closeBtn, btnModalSave, btnModalReset, btnModalCancel;
var modalTime, modalTag, modalDefault, modalSound, modalVolume;
let Timers;
var customSelected, customForm;


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
    modalTag = document.querySelector("#modalTag");
    modalDefault = document.querySelector("#modalDefault");
    modalSound = document.querySelector("#modalSound");
    modalVolume = document.querySelector("#modalVolume");

    customForm = document.querySelector("#form-custom");
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
            tag: "Work",
            time: 25,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            tag: "Short Break",
            time: 5,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            tag: "Long Break",
            time: 10,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            tag: "Custom Timer 1",
            time: 25,
            defaultSound: true,
            soundType: "Ding", 
            volume: 100
        },
        {
            tag: "Custom Timer 2",
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

    Timers[customSelected].time = parseInt(modalTime.value);
    Timers[customSelected].tag = modalTag.value;
    Timers[customSelected].defaultSound = modalDefault.checked;
    Timers[customSelected].soundType = modalSound.value;
    Timers[customSelected].volume = parseInt(modalVolume.value);

    updateBtnDisplay();

    closeModal();
}

function updateBtnDisplay(){
    if(customSelected == 3){
        btnCustom1.textContent = Timers[3].time + " min";
        btnCustom2.disabled = false;
        btnCustom2.classList.remove("btn-greyed");
    }
    else{
        btnCustom2.textContent = Timers[4].time + " min";
    }
}

function resetModal(){
    // set back to default when opened
    customForm.reset();
}
function changeCurrentTime(){
    if(this.classList.contains('btn-greyed')){
        return false;
    }
    else if(this.innerHTML == " + "){
        if(this.id == "btn-cust-1"){
            customSelected = 3; /* index value of selected button */
        }
        else{
            customSelected = 4;
        }
        openModal();
        return false;
    }
    else{
        var seconds = Timers[parseInt(this.dataset.id)].time * 60;
        currentTime = seconds;
        startingTime = currentTime;
        if(statusStart){
            timerFunc(currentTime);
        }
        else{
            displayTimeFormat(currentTime);
        }
        switchTitle(this);
    }
    
}


function switchTitle(selectedButton){
    
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


   timerTitle.innerHTML = Timers[statusSession].tag;
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
        timerTitle.innerHTML = Timers[statusSession].tag;
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
    console.log(currentTime);
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
    console.log(currentTime);
    currentTime = startingTime;
    
    
    if(statusStart){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
}

