window.onload = init;


var btnStart, btnReset; /* start and reset countdown */
var btnWork, btnShort, btnLong, btnCustom1, btnCustom2, buttonsTime; /* hold the quick select buttons */
var timerTitle; /* title in countdown widget */

var statusSession, statusStart; /* start/play button status and type of timer */
var currentTime, startingTime; /* hold current time and starting time for reset */
let countdown; /* holds the interval timer */
var currentTimer;/* holds the current timer  */

/* modal controls */
var modal, closeBtn, btnModalSave, btnModalReset, btnModalCancel;
/* modal form fields */
var modalTime, modalTag, modalDefault, modalSound, modalVolume, defaultCheckMod;
/* selected + button and modal form  */
var customSelected, customForm;


/* object holding quick timers */
let Timers;
/* default settings object */
let settingsDefaults;

/* settings variables */
var settingsTabs;
var currentSettingTab, settingsForm, defaultForm;
var deleteTimer, settingsDisables, defaultCheckSet, defaultReset;

/* test sound buttons */
var btnsSoundTest;

/* auto loop through pomodoro variables */
var loopQueue, loopNum, indexLoop , loopLabel;

/* stats section variables */
var stats, statsinfo, statsTable;
var statToday, statWeek, statTotal, hrLabel;
/* navbar scroll variables */
var navbar  ,yoff;


/* initialize: select all needed buttons, make eventlisteners, initialize any variables */
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
    defaultCheckMod = document.querySelector("#form-custom input[type='checkbox']");
    modalDisables = document.querySelectorAll("#form-custom .defaultDepend");
    

    /* forms  */
    customForm = document.querySelector("#form-custom");
    defaultForm = document.querySelector("#form-settings-default");
    settingsForm = document.querySelector("#form-settings");

    /* settings checkbox dependent */
    settingsDisables = document.querySelectorAll("#form-settings .defaultDepend"); /* areas that can be disabled with check 'defaults?' */
    defaultCheckSet = document.querySelector("#form-settings input[type='checkbox']");

    /* Settings control buttons */
    settingsTabs = document.querySelectorAll(".SettingsTabs > button"); 
    settingsReset = document.querySelector("#resetSettings");
    btnsSoundTest = document.querySelectorAll(".testSound");
    defaultReset = document.querySelector("#resetDefault");
    deleteTimer = document.querySelector("#deleteTimer");

    /* settings notifications */
    settingsNot = document.querySelector("#form-settings > .notification");
    defaultNot = document.querySelector("#form-settings-default > .notification");
    


    /* areas to fill statistics */
    statsTable = document.querySelector("#stats");
    statToday = document.querySelector("#statToday");
    statWeek = document.querySelector("#statWeek");
    statTotal = document.querySelector("#statTotal");
    hrLabel = document.querySelector("#HrLabel");
    /* loop update */
    loopLabel = document.querySelector("#LoopLabel");

    /* check if the session storage is empty */
    if(sessionStorage.length == 0){
        /* init different objects */
        initTimers();
        initDefaults();
        initStats();
    }
    else{
        /* restory objects and settings */
        restoreSession();
    }

    /* initialize starting features */
    currentTimer = Timers[0];
    currentTime = Timers[0].time * 60;
    startingTime = currentTime;
    currentSettingTab = 0; /* index of setting tab */

    // initial status settings 
    statusSession = 0; /* value of selected timer, same is Timers index*/
    statusStart = false; /* whether timer is paused or started */
    customSelected = 0;
    
    /* set up all button listeners */
    buttonListenerSetup();

    /* scroll listener */
    navbar = document.querySelector(" header");
    yoff = navbar.offsetTop;
    window.onscroll = function() { navSetup() };
    
}
// 
// 
// 
// Setup
// 
// 
// 

function navSetup(){
    /* check for scroll, add class based on status */
    if(window.pageYOffset > yoff){
        navbar.classList.add("sticky");
    }
    else{
        navbar.classList.remove("sticky");
    }
}

/* initialize default settings object */
function initDefaults(){
    settingsDefaults = {
        soundType: "jingle",
        volume: 80,
        autoLoop: true,
        numTimers: 9,
        loopQ: [
            {
                // 0
                timers: ["0", "1"],
                repeats: 4
            },
            {
                // 1
                timers: ["2"],
                repeats: 1
            }
        ]
        
    };
    /* initialize the queue based on settings */
    initQueue();
}

/* initialize the queue */
function initQueue(){
    indexLoop = 0;
    loopQueue = [];
    loopNum = [];
    var loophold = 1;

    console.log(loopQueue);
    /* go through each timer in defaults and add to queue */
    settingsDefaults.loopQ.forEach(function(element){
        for(i = 0 ; i < element.repeats; i++){
            loopQueue.push(...element.timers);
            for( j= 0; j < element.timers.length; j++){
                loopNum.push(loophold);
            }
            loophold ++;
        }
    });
}

/* initialize pomodoro standard timer objects */
function initTimers(){
    Timers = [
        {
            tag: "Work",
            time: 25,
            seconds:0,
            defaultSound: true,
            soundType: "ding", 
            volume: 80,
            index: 0
        },
        {
            tag: "Short Break",
            time: 5,
            seconds:0,
            defaultSound: false,
            soundType: "elevator", 
            volume: 50,
            index: 1
        },
        {
            tag: "Long Break",
            time: 10,
            seconds:0,
            defaultSound: true,
            soundType: "tone", 
            volume: 100,
            index: 2
        },
        {
            tag: "Custom 1",
            time: 25,
            seconds:0,
            defaultSound: true,
            soundType: "bell", 
            volume: 100,
            index: 3,
            on: false
        },
        {
            tag: "Custom 2",
            time: 25,
            seconds:0,
            defaultSound: true,
            soundType: "jingle", 
            volume: 100,
            index: 4,
            on: false
        }
    ]
}

/* all listeners check if addEventListener works */
function buttonListenerSetup(){
    
    /* buttons on timer widget */
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

    /* settings tabs */
    settingsTabs.forEach(function(element){
        if(element.addEventListener){
            element.addEventListener('click', changeSettingsTab);
        }else{
            // internet explorer < 9
            element.attachEvent('onclick', changeSettingsTab);
        }
    })

    /* buttons that test current sound settings */
    btnsSoundTest.forEach(function(element){
        if(element.addEventListener){
            element.addEventListener('click', testSound);
        }else{
            // internet explorer < 9
            element.attachEvent('onclick', testSound);
        }
    })

    /* form submissions settings */
    if(document.form_settings_default.addEventListener){
        document.form_settings_default.addEventListener('submit', submitDefault);
    }else{
        // internet explorer < 9
        document.form_settings_default.attachEvent('onsubmit', submitDefault);
    }
    if(document.form_settings.addEventListener){
        document.form_settings.addEventListener('submit', submitSettings);
    }else{
        // internet explorer < 9
        document.form_settings.attachEvent('onsubmit', submitSettings);
    }

    /* buttons at the bottom of forms : reset and delete */
    if(settingsReset.addEventListener){
        settingsReset.addEventListener('click', resetSettings);
    }else{
        // internet explorer < 9
        settingsReset.attachEvent('onclick', resetSettings);
    }

    if(defaultReset.addEventListener){
        defaultReset.addEventListener('click', resetDefault);
    }else{
        // internet explorer < 9
        defaultReset.attachEvent('onclick', resetDefault);
    }

    if(deleteTimer.addEventListener){
        deleteTimer.addEventListener('click', deleteCurrentTimer);
    }else{
        // internet explorer < 9
        deleteTimer.attachEvent('onclick', deleteCurrentTimer);
    }

    /* see if 'defaults?' checked in settings and modal */
    if(defaultCheckSet.addEventListener){
        defaultCheckSet.addEventListener('change', switchDefaultSet);
    }else{
        // internet explorer < 9
        defaultCheckSet.attachEvent('onchange', switchDefaultSet);
    }

    
    if(defaultCheckMod.addEventListener){
        defaultCheckMod.addEventListener('change', switchDefaultMod);
    }else{
        // internet explorer < 9
        defaultCheckMod.attachEvent('onchange', switchDefaultMod);
    }


}


// 
// 
// 
// Session Section 
// 
// 
// 

/* save current settings in sessionStorage */
function saveSession(){
    sessionStorage.setItem('timers', JSON.stringify(Timers));
    sessionStorage.setItem('settings', JSON.stringify(settingsDefaults));
}
/* restore all previous settings */
function restoreSession(){
    /* restore objects Timers, default settings */
    Timers = JSON.parse(sessionStorage.getItem('timers'));
    settingsDefaults = JSON.parse(sessionStorage.getItem('settings'));
    /* Stat and Loop Resetup */
    loadStats();
    initQueue();
    /* fill default form */
    fillDefault();
    // switch button labels
    for(i = 0; i < 3; i++){
        updateBtnDisplay(i);
        updateDefaultLoop(i);
    }
    if(Timers[3].on){
        customSelected = 3;
        updateBtnDisplay(3);
        updateDefaultLoop(3);
    }
    if(Timers[4].on){
        updateBtnDisplay(4);
        updateDefaultLoop(4);
    }
    
}

// 
// 
// 
//  Modal functionality 
// 
// 
// 
/* close, reset modal and move to top of page */
function closeModal(){
    modal.style.display = "none";
    resetModal();
    customSelected = 0;
    window.location.hash= 'top';
}

/* open modal and set up close listeners */
function openModal(){
    /* open and move page to modal section */
    modal.style.display = "block";
    window.location.hash= 'myModal';

    /* close listeners */
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

    /* custom form submit listener */
    if(customForm.addEventListener){
        customForm.addEventListener('submit', submitCustom);
    }else{
        // internet explorer < 9
        customForm.attachEvent('onsubmit', submitCustom);
    }

    /* modal button listeners  */
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

// save custom form
function submitCustom(){
    // check form is filled correctly

    if(!event.target.isValid){
        event.preventDefault();
        // get the filled in form values
        var minNew = parseInt(modalTime.value);
        /* save minutes */
        if(minNew){
            Timers[customSelected].time = minNew;
        }
        else{
            Timers[customSelected].time = 0;
        }
        /* save seconds */
        var secNew = parseInt(customForm.elements.namedItem("modalTimeSec").value);
        if(secNew){
            Timers[customSelected].seconds = secNew;
        }
        else{
            Timers[customSelected].seconds = 0;
        }
        
        /* save all other values */
        Timers[customSelected].tag = modalTag.value;
        Timers[customSelected].defaultSound = modalDefault.checked;
        Timers[customSelected].soundType = modalSound.value;
        Timers[customSelected].volume = parseInt(modalVolume.value);

        /* update button that was + */
        updateBtnDisplay(customSelected);
        /* fix selected timer settings and save then close modal */
        Timers[customSelected].on = true;
        enableTimer(customSelected);
        updateDefaultLoop(customSelected);
        saveSession();
        closeModal();
        
    }
}

// updates button display based on button
function updateBtnDisplay(buttonNum){
    
    // check if first + and enables other +
    if(customSelected == 3){
        buttonsTime[4].disabled = false;
        buttonsTime[4].classList.remove("btn-greyed");

        settingsTabs[5].disabled = false;
        settingsTabs[5].classList.remove("btn-greyed");
    }
    // fills btn display based on Timer settings ( 1 min, 10:20 , or 2 sec display)
    if(Timers[buttonNum].time == 0 && Timers[buttonNum].seconds != 0){
        buttonsTime[buttonNum].textContent = Timers[buttonNum].seconds + " sec";
    }
    else if(Timers[buttonNum].seconds == 0 ){
        buttonsTime[buttonNum].textContent = Timers[buttonNum].time + " min";
    }
    else{
        if(Timers[buttonNum].seconds < 10){
            buttonsTime[buttonNum].textContent = Timers[buttonNum].time + " : 0" + Timers[buttonNum].seconds;
        }
        else{
            buttonsTime[buttonNum].textContent = Timers[buttonNum].time + " : " + Timers[buttonNum].seconds;
        }
        
    }
    settingsTabs[buttonNum + 1].textContent = Timers[buttonNum].tag + " Timer";
    
}
// reset modal
function resetModal(){
// set back to default when opened
customForm.reset();
}

/* disables alerts section if using defaults */

function switchDefaultMod(){
    console.log(modalDisables);
    if(this.checked){
        modalDisables.forEach(function(element){
                element.disabled = true;
        });
    }
    else{
        modalDisables.forEach(function(element){
            element.disabled = false;
    });
    }
}

// 
// 
// 
//  Delete Timer
// 
// 
// 

// reverse of adding Timer, grey out if needed
function deleteCurrentTimer(){
    /* grey last button if both customs are + */
    if((currentSettingTab == 4 && settingsTabs[5].textContent === " + ") || (currentSettingTab == 5 && settingsTabs[4].textContent === " + ")){
        
            buttonsTime[4].disabled = true;
            buttonsTime[4].classList.add("btn-greyed");
    
            settingsTabs[5].disabled = true;
            settingsTabs[5].classList.add("btn-greyed");
       
    }
    /* change button displays */
    buttonsTime[currentSettingTab-1].textContent = " + ";
    settingsTabs[currentSettingTab].textContent = " + ";
    
    /* save settings */
    Timers[currentSettingTab-1].on = false;
    disableTimer(currentSettingTab-1);
    /* check if defaults broken because of delete */
    checkLoop();
    settingsTabs[0].click();
    saveSession();
}

// 
// 
// 
//  Quick Time Buttons
// 
// 
// 

/* change the current timer or open modal */
function changeCurrentTime(){
    /* don't open disabled button */
    if(this.classList.contains('btn-greyed')){
        return false;
    }
    /* open modal if + not assigned button */
    else if(this.textContent == " + "){
        if(this.id == "btn-cust-1"){
            customSelected = 3; /* index value of selected button */
        }
        else{
            customSelected = 4;
        }
        openModal();
        return false;
    }
    /* set time based on button clicked */
    else{
        var index = parseInt(this.dataset.id);
        timeSet(index);
        /* check if start of loop */
        if(currentTimer.tag !== Timers[loopQueue[0]].tag){
            /* if not display timer tag */
            setloopLabel(currentTimer.tag);
        }
        else{
            /* display #1 loop */
            resetLoopIndex();
        }

    }
    
}

/* set the current time in countdown and/or start new timer */
function timeSet(index){
    /* find values of time */
    var seconds = Timers[index].time * 60;
    /* if there are seconds in current timer, add to time */
    var secs = Timers[index].seconds;
    if(secs > 0){
        seconds += secs;
    }
    /* save times in seconds*/
    currentTime = seconds;
    startingTime = seconds;

    /* if a timer is playing, create new countdown with new time */
    if(statusStart){
        timerFunc(currentTime);
    }
    /* else display current selected timer in display section (formatted) */
    else{
        displayTimeFormat(currentTime);
    }
    /* switch the heading title based on clicked timer */
    switchTitle(buttonsTime[index]);
    currentTimer = Timers[index];/* store clicked timer */
}

// change title in timer widget 
function switchTitle(selectedButton){
    
    /* save which timer index clicked */
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

    /* display clicked timer tag */
    timerTitle.innerHTML = Timers[statusSession].tag;
}


// 
// 
// 
// Timer Loop Functions 
// 
// 
// 
// 
/* set loop label to input (when not the start of a loop) */
function setloopLabel(Labelnew){
    loopLabel.textContent = Labelnew;
}
/* update to next loop display */
function updateloopLabel(){

    loopLabel.textContent = "Loop : # " + loopNum[indexLoop] + " " + Timers[loopQueue[indexLoop]].tag;

}
/* reset label to display first in loop */
function resetLoopIndex(){
indexLoop = 0;
updateloopLabel();
}
// 
// 
// 
// Timer Functions 
// 
// 
// 
// 

/* countdown timer functionality */
function timerFunc(seconds) {
    /* delete any previous timers */
    clearInterval(countdown);

    /* get current time */
    const now = Date.now();
    const then = now + (seconds * 1000); /* add time of countdown in milliseconds to starting time*/
    /* display current time */
    displayTimeFormat(seconds);
    /* save starting time */
    startingTime = currentTime;

    /* start a timer  */
    countdown = setInterval( () => {
        /* find time between current time and time when the Timer will be done */
       const secondsLeft = Math.round((then - Date.now() ) / 1000);

       /* if no time left play alarm, add to stats, and check for loop */
        if(secondsLeft < 0){
            /* alarm */
            playAlarm(currentTimer);
            
            /* statistics */
            var finTimer = addToStats(currentTimer.index);
            saveStats();
            addToTable(finTimer);
            

            /* loop to next if enabled*/
            if(settingsDefaults.autoLoop){

                /* if you finished a timer in the correct index of queue */
                if( loopQueue[indexLoop] == currentTimer.index ){
                    /* move to next timer in loop */
                    indexLoop++;
                    /* if you finished loop, reset to beginning and continue */
                    if(indexLoop >= settingsDefaults.numTimers){
                        resetLoopIndex();
                        
                    }
                    
                    /* get new Timer index from queue */
                    var indexNew = loopQueue[indexLoop];
                    
                    var TimeOBjNew = Timers[indexNew];
                    timeSet(TimeOBjNew.index);
                    
                }
                else{
                    /* end timer if no next in loop */
                    clearInterval(countdown); 
                    
                }
                // set label to new timer in loop 
                updateloopLabel();
            }
            else{
                /* end timer if no autoloop set */
                clearInterval(countdown); 
            }
            
            return;
        }
        /* display new time */
        displayTimeFormat(secondsLeft);
    },1000);
}
// 
// 
// 
// Timer Controls 
// 
// 
// 
// 
/* set to start or pause, update button */
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

/* start timer */
function startTimer(){
    timerFunc(currentTime);
}
/* pause timer */
function pauseTimer(){
    clearInterval(countdown);
}
/* reset timer to starting time of the Timer type started on */
function resetTimer(){
    currentTime = startingTime;
    
    
    if(statusStart){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
}


// 
// 
// 
// 
// Display time in timer widget + formatting
// 
// 
// 
// 

/* format the input of seconds and display in widget */
function displayTimeFormat(seconds){
    currentTime = seconds;
   
    const display = getFormattedTime(seconds);
    timer.textContent =  display;
    document.title = display;
} 
/* return formatted time */
function getFormattedTime(seconds){
    const minutes = Math.floor ( seconds / 60 );
    const remainderSeconds = seconds % 60;
    return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
}
// 
// 
// 
// Settings Section 
// 
// 
// 

// change which setting tab on
function changeSettingsTab(){

    /* if tab is already selected ignore rest */
    if(this.classList.contains('btn-tab-select')){
        return false;
    }
    /* if button is + behave like quick time menu : open modal */
    else if(this.textContent == " + "){
        if(!this.classList.contains('btn-greyed')){
            if(this.id == "Custom1Tab"){
                customSelected = 3; /* index value of selected button */
            }
            else{
                customSelected = 4;
            }
            openModal();
        }
        return false;
    }
    /* change to new tab */
    else{
        /* get selected index */
        var selectedTab = Array.from(settingsTabs).indexOf(event.target);

        /* if default tab then show default form, hide timer form */
        if(selectedTab == 0 ){
            // display default form
            defaultForm.classList.remove('hide');
            settingsForm.classList.add('hide');

        }
        /* switch to settings form */
        else{
            // display timer form and fill in info
            /* if the previously selected tab was default switch to settings form */
            if(currentSettingTab == 0 ){
                defaultForm.classList.add('hide');
                settingsForm.classList.remove('hide');
            }
            /* if the previous tabs were 4 or 5, hide delete timer button */
            else if(currentSettingTab == 4 || currentSettingTab == 5){
                deleteTimer.classList.add("btn-hidden");
            }
            /* if new tab is 4 or 5 (customs) add delete button */
            if(selectedTab == 4 || selectedTab == 5){
                deleteTimer.classList.remove("btn-hidden");
            }
            /* make the notifications for other tabs disappear */
            settingsNot.classList.remove("is-visible");

            /* switch form values for settings of current timer */
            switchFormValues(settingsForm, Timers[selectedTab - 1]);
        }

        // new current tab set to clicked
        settingsTabs[currentSettingTab].classList.remove('btn-tab-select');
        this.classList.add('btn-tab-select');
        currentSettingTab = selectedTab;
        

        
    }
}

/* switch form values in given form with given timer object values */
function switchFormValues( formName, timerObject){
   
    /* update times */
    var minNew =  timerObject.time;
    if(minNew > 0){
        formName.elements.namedItem("settingsTime").value = minNew;
    }
    else{
        formName.elements.namedItem("settingsTime").value = '';
    }
    var secNew = timerObject.seconds;
    if(secNew > 0){
        formName.elements.namedItem("settingsTimeSec").value = secNew;
    }
    else{
        formName.elements.namedItem("settingsTimeSec").value = '';
    }
     /* update others */
     formName.elements.namedItem("settingsTag").value = timerObject.tag;
     formName.elements.namedItem("settingsDefault").checked = timerObject.defaultSound;
  
     /* disable if timer is using default sound */
    settingsDisables.forEach(function(element){
        if(timerObject.defaultSound){
            element.disabled = true;
        }
        else{
            element.disabled = false;
        }
    });
    
    /* update alerts section */
   switchAlerts(formName, timerObject);

    

}

/* update soundtype and volume for form */
function switchAlerts(formName, Obj){
    
    formName.elements.namedItem("settingsSound").value = Obj.soundType;
    formName.elements.namedItem("settingsVolume").value = Obj.volume;
}

/* submit settings form */
function submitSettings(){
 /* if settings form valid  */
    if(!event.target.isValid){

        event.preventDefault();/* prevent actual submit */

        /* get times */
        var minNew = parseInt(settingsForm.elements.namedItem("settingsTime").value);
       
        if(minNew){
            Timers[currentSettingTab-1].time = minNew;
        }
        else{
            Timers[currentSettingTab-1].time = 0;
        }

        var secNew = parseInt(settingsForm.elements.namedItem("settingsTimeSec").value);
        if(secNew){
            Timers[currentSettingTab-1].seconds  = secNew;
        }
        else{
            Timers[currentSettingTab-1].seconds  = 0;
        }

        /* get other values */
        Timers[currentSettingTab-1].tag = settingsForm.elements.namedItem("settingsTag").value;
        Timers[currentSettingTab-1].defaultSound = settingsForm.elements.namedItem("settingsDefault").checked;
        Timers[currentSettingTab-1].soundType = settingsForm.elements.namedItem("settingsSound").value;
        Timers[currentSettingTab-1].volume = settingsForm.elements.namedItem("settingsVolume").value;
        /* update buttons based on saved settings */
        updateBtnDisplay(currentSettingTab-1);

        /* update default loop options based on save */
        updateDefaultLoop(currentSettingTab-1);
        // show alert that saved
        settingsNot.classList.add("is-visible");
        setTimeout(function(){
            settingsNot.classList.remove("is-visible");
        },5000);
        saveSession();
    }
}

/* reset settings form */
function resetSettings(){
    switchFormValues(settingsForm, Timers[currentSettingTab - 1]);
}
/* disables the alerts section if checked that will use defaults */
function switchDefaultSet(){
    if(this.checked){
        settingsDisables.forEach(function(element){
                element.disabled = true;
        });
    }
    else{
        settingsDisables.forEach(function(element){
            element.disabled = false;
    });
    }
}

// 
// 
// 
// Default Form 
// 
// 
// 
/* reset default form */
function resetDefault(){
    fillDefault();
}

/* fills default form with alerts,check and loop setup */
function fillDefault(){
    switchAlerts(defaultForm, settingsDefaults);
    defaultForm.elements.namedItem("autoLoop").checked = settingsDefaults.autoLoop;
    fillLoopSetup();

    
}

/* updates the options available in dropdown for loop settings (defaults) */
function updateDefaultLoop(optionIndex){
    defaultForm.elements.namedItem("loopdrops_1").options[optionIndex].textContent = Timers[optionIndex].tag;
    defaultForm.elements.namedItem("loopdrops_2").options[optionIndex].textContent = Timers[optionIndex].tag;
    defaultForm.elements.namedItem("loopdrops_3").options[optionIndex].textContent = Timers[optionIndex].tag;
}

/* fills loop using defaults */
function fillLoopSetup(){
    
    defaultForm.elements.namedItem("loopdrops_1").value = settingsDefaults.loopQ[0].timers[0];
    defaultForm.elements.namedItem("loopdrops_2").value = settingsDefaults.loopQ[0].timers[1];
    defaultForm.elements.namedItem("loopdrops_3").value = settingsDefaults.loopQ[1].timers[0];

    /* check if timer enabled or not and set */
    if(Timers[3].on){
        enableTimer(3);
    }
    else{
        disableTimer(3);
    }
    if(Timers[4].on){
        enableTimer(4);
    }
    else{
        disableTimer(4);
    }
    
}

/* check  to see if deleting caused loop break*/
function checkLoop(){
    var temp = defaultForm.elements.namedItem("loopdrops_1").value;
    
    /* if the timer is not enabled then switch to standard pomodoro timers */
    if(  !Timers[temp].on  ){
        defaultForm.elements.namedItem("loopdrops_1").value = "0";
    }

    temp = defaultForm.elements.namedItem("loopdrops_2").value;
    if(  !Timers[temp].on  ){
        defaultForm.elements.namedItem("loopdrops_2").value = "1";
    }
    
    temp = defaultForm.elements.namedItem("loopdrops_3").value;
    if(  !Timers[temp].on ){
        defaultForm.elements.namedItem("loopdrops_3").value = "2";
    }
    submitDefault();
}

/* enable timer in the dropdowns */
function enableTimer(num){
    defaultForm.elements.namedItem("loopdrops_1").options[num].disabled = false;
    defaultForm.elements.namedItem("loopdrops_2").options[num].disabled = false;
    defaultForm.elements.namedItem("loopdrops_3").options[num].disabled = false;
}
/* disable a timer in the dropdowns */
function disableTimer(num){
    defaultForm.elements.namedItem("loopdrops_1").options[num].disabled = true;
    defaultForm.elements.namedItem("loopdrops_2").options[num].disabled = true;
    defaultForm.elements.namedItem("loopdrops_3").options[num].disabled = true;
}

/* submit the default form  */
function submitDefault(){
    if(!event.target.isValid){
        event.preventDefault();

        /* save values */
        settingsDefaults.soundType = defaultForm.elements.namedItem("settingsSound").value;
        settingsDefaults.volume = defaultForm.elements.namedItem("settingsVolume").value;

        settingsDefaults.autoLoop = defaultForm.elements.namedItem("autoLoop").checked;

        Timers[defaultForm.elements.namedItem("loopdrops_1").value].tag;


        settingsDefaults.loopQ[0].timers[0] = defaultForm.elements.namedItem("loopdrops_1").value;
        settingsDefaults.loopQ[0].timers[1] = defaultForm.elements.namedItem("loopdrops_2").value;
        settingsDefaults.loopQ[1].timers[0] = defaultForm.elements.namedItem("loopdrops_3").value;

        /* display save notification  */
        defaultNot.classList.add("is-visible");
        setTimeout(function(){
            defaultNot.classList.remove("is-visible");
        },5000);
        saveSession();
    }
   
}


// 
// 
// 
// Audio Section 
// 
// 
// 

/* play alarm */
function playAlarm(timerObj){
    var audio;
    /* if current timer is using default, play that */
    if(timerObj.defaultSound == true){
        audio = document.querySelector(`audio[data-sound = "${settingsDefaults.soundType}"]`);
        audio.volume = settingsDefaults.volume / 100;
    }
    /* else play its sound */
    else{
        audio = document.querySelector(`audio[data-sound = "${timerObj.soundType}"]`);
        audio.volume = timerObj.volume / 100;
    }
    
    /* reset to start and play */
    audio.currentTime = 0;
    audio.play();
}

/* test sound button functionality */
function testSound(){

    /* find form values */
    var testVol, testSoundType;
    /* modal test clicked */
    if(event.target.classList.contains("modalTest")){
        testVol = customForm.elements["modalVolume"].value;
        testSoundType = customForm.elements["modalSound"].value;
    }
    /* default test clicked */
    else if(event.target.id == "defaultTest"){
        
        testVol = defaultForm.elements["settingsVolume"].value;
        testSoundType = defaultForm.elements["settingsSound"].value;
    }
    /* settings only other one, clicked */
    else{
        testVol = settingsForm.elements["settingsVolume"].value;
        testSoundType = settingsForm.elements["settingsSound"].value;
    }
    /* make object with form values */
    var testSoundObj ={
        soundType: testSoundType,
        volume:testVol,
        defaultSound: false
    }
    /* play with sound object */
    playAlarm(testSoundObj);
   return false;
}




// 
// 
// 
// Stats Section 
// 
// 
// 
/* initialize what statsinfo holds */
function initStats(){
    stats = [];
    statsinfo = { /* will hold today, weekstart, total  */
        total : 0,
        todayTotal : 0,
        weekTotal : 0,
        num : 1
    };
    /* create object for todays date */
    createToday();
    /* create object for start of week date */
    createWeekStart();
}

/* add value of timer at ind to stats */
function addToStats(ind){
    /* make object with stats info needed and push into stats array */
    var finTimer = {};
    finTimer.date = new Date();
    finTimer.tag = Timers[ind].tag;
    finTimer.time = (Timers[ind].time * 60 ) + Timers[ind].seconds;
    stats.push(finTimer);

    //check if work timer add to totals
    if(ind == 0){
        addTotals(ind, finTimer);
    }    
    /* return the finished timer for other function */
    return finTimer;
}

/* save stats to storage */
function saveStats(){
    sessionStorage.setItem('stats', JSON.stringify(stats));
    sessionStorage.setItem('statsinfo', JSON.stringify(statsinfo));
}
/* load stats from storage */
function loadStats(){
    /* get back stats info/array */
    stats = JSON.parse(sessionStorage.getItem('stats'));
    statsinfo = JSON.parse(sessionStorage.getItem('statsinfo'));
    
    /* load stats for the day and week */
    statsinfo.today = new Date(statsinfo.today);
    statsinfo.week = new Date(statsinfo.week);
    /* reset num so when table added to increases */
    statsinfo.num = 1;

    // add all to table
    for( i = 0; i < stats.length; i++){
        stats[i].date = new Date(stats[i].date);
        addToTable(stats[i]);
    }
    /* update stats display values */
    updateStatDisplay();
}
/* add the timer to table at num index */
function addToTable(finishedTimer){
    /* add new row for completed timer */
    var row = statsTable.insertRow(statsinfo.num);
    statsinfo.num ++;
    /* add date, name of timer and time completed */
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = (finishedTimer.date.getMonth() + 1) + "/" + finishedTimer.date.getDate() + "/" + finishedTimer.date.getFullYear(); /* edit to show time in 12/12/12 format */
    cell2.innerHTML = finishedTimer.tag; 
    cell3.innerHTML = getFormattedTime(finishedTimer.time); /* edit to show min : seconds */
   
}

/* create new date for today;called if changed days */
function createToday(){
    statsinfo.today = new Date();
}

/* create new date with the starting day of week : start Sunday  */
function createWeekStart(){
    var tod = new Date();
    statsinfo.week = getWeekStart(tod);
}

/* get the start of the week based on input day */
function getWeekStart(currentDay){
    var shift = currentDay.getDay();
    return new Date(currentDay.getYear(), currentDay.getMonth(), currentDay.getDate() - shift );
}
/* add to totals with finished timer stats */
function addTotals(ind, finTimer){
    var compare = finTimer.date;
    var compareWeek = getWeekStart(compare);
    // check if timer finished in the same day as stored today - update day total 
    if( compareDay(compare, statsinfo.today )){
        statsinfo.todayTotal += finTimer.time;
    }
    else{
        /* create new day  */
        createToday();
        /* total just finished timer */
        statsinfo.todayTotal = finTimer.time;
    }
    // check if timer finished in the same day as stored today - update week total
    if( compareDay(compareWeek, statsinfo.week )){
        statsinfo.weekTotal += finTimer.time;
    }
    else{
        createToday();
        statsinfo.weekTotal = finTimer.time;
    }

    /* always add to total */
    statsinfo.total += finTimer.time;

    /* update displays */
    updateStatDisplay();

   
}

/* check if the two dates are on the same day (year, month, day check) */
function compareDay(day1, day2){
    return day1.getFullYear() === day2.getFullYear() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getDate() === day2.getDate();
}

function updateStatDisplay(){
// update under timer widget 
    hrLabel.textContent = "Time Worked Today: " + getFormattedTime ( statsinfo.todayTotal );
// update under stat title
    statToday.textContent = "Time Worked Today: " + getFormattedTime ( statsinfo.todayTotal );
    statWeek.textContent = "Time Worked This Week: " + getFormattedTime ( statsinfo.todayTotal );
    statTotal.textContent = "Total Time Worked: " + getFormattedTime ( statsinfo.todayTotal );
    
}