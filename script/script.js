window.onload = init;


var btnStart, btnReset;
var btnWork, btnShort, btnLong, btnCustom1, btnCustom2, buttons;

var timerTitle;
var statusSession, statusStart; /* start/play button status and type of timer */
var currentTime, startingTime; /* hold current time and starting time for reset */
let countdown; /* holds the interval timer */
var modal, closeBtn, btnModalSave, btnModalReset, btnModalCancel;
var modalTime, modalTag, modalDefault, modalSound, modalVolume, defaultCheckMod;
let Timers;
let SettingsDefaults;
var customSelected, customForm;
var buttonsTime, settingsTabs;
var currentSettingTab, settingsForm, defaultForm;
var deleteTimer, settingsDisables, defaultCheckSet, defaultReset;
var currentTimer,btnsSoundTest;
var navbar,yoff;
var LoopQueue, LoopNum, indexLoop , LoopLabel;

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
    
    customForm = document.querySelector("#form-custom");
    defaultForm = document.querySelector("#form-settings-default");
    settingsForm = document.querySelector("#form-settings");
    settingsDisables = document.querySelectorAll("#form-settings .defaultDepend");
    defaultCheckSet = document.querySelector("#form-settings input[type='checkbox']");
    defaultReset = document.querySelector("#resetDefault");
    settingsNot = document.querySelector("#form-settings > .notification");
    defaultNot = document.querySelector("#form-settings-default > .notification");
    deleteTimer = document.querySelector("#deleteTimer");
    

    settingsTabs = document.querySelectorAll(".SettingsTabs > button");
    
    settingsReset = document.querySelector("#resetSettings");

    btnsSoundTest = document.querySelectorAll(".testSound");
    
    LoopLabel = document.querySelector("#LoopLabel");
    if(sessionStorage.length == 0){
        initTimers();
        initDefaults();
    }
    else{
        restoreSession();
    }
    currentTimer = Timers[0];
    currentTime = Timers[0].time * 60;
    startingTime = currentTime;
    currentSettingTab = 0; /* index of setting tab */
    // initial status settings 
    statusSession = 0; /* value of selected timer, same is Timers index*/
    statusStart = false; /* whether timer is paused or started */
    customSelected = 0;
    

    navbar = document.querySelector(" header");
    buttonListenerSetup();
    
    yoff = navbar.offsetTop;
    window.onscroll = function() { navSetup() };
    
}


// Setup 
function navSetup(){
    if(window.pageYOffset > yoff){
        navbar.classList.add("sticky");
    }
    else{
        navbar.classList.remove("sticky");
    }
}
function initDefaults(){
    SettingsDefaults = {
        soundType: "jingle",
        volume: 80,
        autoLoop: true,
        numTimers: 9,
        loopQ: [
            {
                // 0
                timers: ["Work", "Short Break"],
                repeats: 4
            },
            {
                // 1
                timers: ["Long Break"],
                repeats: 1
            }
        ]
        
    };
    initQueue();
}

function initQueue(){
    indexLoop = 0;
    LoopQueue = [];
    LoopNum = [];
    var loophold = 1;
    SettingsDefaults.loopQ.forEach(function(element){
        for(i = 0 ; i < element.repeats; i++){
            LoopQueue.push(...element.timers);
            for( j= 0; j < element.timers.length; j++){
                LoopNum.push(loophold);
            }
            loophold ++;
        }
    });
    
    console.log(LoopQueue);
    console.log(LoopNum);
}
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

    settingsTabs.forEach(function(element){
        if(element.addEventListener){
            element.addEventListener('click', changeSettingsTab);
        }else{
            // internet explorer < 9
            element.attachEvent('onclick', changeSettingsTab);
        }
    })

    btnsSoundTest.forEach(function(element){
        if(element.addEventListener){
            element.addEventListener('click', testSound);
        }else{
            // internet explorer < 9
            element.attachEvent('onclick', testSound);
        }
    })

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
//  Modal functionality 
// 
// 
// 
function closeModal(){
    modal.style.display = "none";
    resetModal();
    customSelected = 0;
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

    if(customForm.addEventListener){
        customForm.addEventListener('submit', submitCustom);
    }else{
        // internet explorer < 9
        customForm.attachEvent('onsubmit', submitCustom);
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

// save custom form
function submitCustom(){
    // check form is filled

    if(!event.target.isValid){
        event.preventDefault();
    // get the filled in form values
        var minNew = parseInt(modalTime.value);
        if(minNew){
            Timers[customSelected].time = minNew;
        }
        else{
            Timers[customSelected].time = 0;
        }
        
        var secNew = parseInt(customForm.elements.namedItem("modalTimeSec").value);
        if(secNew){
            Timers[customSelected].seconds = secNew;
        }
        else{
            Timers[customSelected].seconds = 0;
        }
        
        Timers[customSelected].tag = modalTag.value;
        Timers[customSelected].defaultSound = modalDefault.checked;
        Timers[customSelected].soundType = modalSound.value;
        Timers[customSelected].volume = parseInt(modalVolume.value);

        updateBtnDisplay(customSelected);
        Timers[customSelected].on = true;
        saveSession();
        closeModal();
        
    }
}

// updates previously + greyed buttons display
function updateBtnDisplay(buttonNum){
    

    if(customSelected == 3){
        buttonsTime[4].disabled = false;
        buttonsTime[4].classList.remove("btn-greyed");

        settingsTabs[5].disabled = false;
        settingsTabs[5].classList.remove("btn-greyed");
    }
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

// 
// 
// 
//  Delete Timer
// 
// 
// 


function deleteCurrentTimer(){
    
    if(currentSettingTab == 4){
        buttonsTime[4].disabled = true;
        buttonsTime[4].classList.add("btn-greyed");

        settingsTabs[5].disabled = true;
        settingsTabs[5].classList.add("btn-greyed");
    }

    buttonsTime[currentSettingTab-1].textContent = " + ";
    settingsTabs[currentSettingTab].textContent = " + ";
    
    Timers[currentSettingTab-1].on = false;
    settingsTabs[currentSettingTab-1].click();
    saveSession();
}

// 
// 
// 
//  Quick Time Buttons
// 
// 
// 

function changeCurrentTime(){
    if(this.classList.contains('btn-greyed')){
        return false;
    }
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
    else{
        var index = parseInt(this.dataset.id);
        timeSet(index);
        if(currentTimer.tag !== "Work"){
            setLoopLabel(currentTimer.tag);
        }
        else{
            resetLoopIndex();
        }

    }
    
}

function timeSet(index){
    var seconds = Timers[index].time * 60;
    var secs = Timers[index].seconds;
    if(secs > 0){
        seconds += secs;
    }
    currentTime = seconds;
    startingTime = seconds;
    if(statusStart){
        timerFunc(currentTime);
    }
    else{
        displayTimeFormat(currentTime);
    }
    switchTitle(buttonsTime[index]);
    currentTimer = Timers[index];
}

// change title in timer widget 
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

// 
// 
// 
// Timer Controls 
// 
// 
// 
// 
function setLoopLabel(Labelnew){
    LoopLabel.textContent = Labelnew;
}
function updateLoopLabel(){

    LoopLabel.textContent = "Loop : # " + LoopNum[indexLoop] + " " + LoopQueue[indexLoop];

}
function resetLoopIndex(){
indexLoop = 0;
updateLoopLabel();
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
            playAlarm(currentTimer);
            if(SettingsDefaults.autoLoop){
                if( LoopQueue[indexLoop] == currentTimer.tag ){
                    indexLoop++;
                    
                    if(indexLoop >= SettingsDefaults.numTimers){
                        resetLoopIndex();
                        
                    }
                    
                    var Namenew = LoopQueue[indexLoop];
                    
                    var TimeOBjNew = Timers.find(function(obj) { return obj.tag === `${Namenew}`});
                    timeSet(TimeOBjNew.index);
                    
                }
                else{
                    resetLoopIndex();
                    timeSet(0);
                    
                }
                // set label function 
                updateLoopLabel();
            }
            else{
                clearInterval(countdown); 
            }
            
            return;
        }

        displayTimeFormat(secondsLeft);
    },1000);
}
// 
// Timer control buttons
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


// 
// 
// 
// 
// Display time in timer widget + formatting
// 
// 
// 
// 

function displayTimeFormat(seconds){
    currentTime = seconds;
    console.log(currentTime);
    const minutes = Math.floor ( seconds / 60 );
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timer.textContent =  display;
    document.title = display;
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
    if(this.classList.contains('btn-tab-select')){
        return false;
    }
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
    else{
        var selectedTab = Array.from(settingsTabs).indexOf(event.target);

        if(selectedTab == 0 ){
            // display default form
            defaultForm.classList.remove('hide');
            settingsForm.classList.add('hide');

        }
        else{
            // display timer form and fill in info

            if(currentSettingTab == 0 ){
                defaultForm.classList.add('hide');
                settingsForm.classList.remove('hide');
            }
            else if(currentSettingTab == 4 | currentSettingTab == 5){
                deleteTimer.classList.add("btn-hidden");
            }
            if(selectedTab == 4 || selectedTab == 5){
                deleteTimer.classList.remove("btn-hidden");
            }
            settingsNot.classList.remove("is-visible");
            switchFormValues(settingsForm, Timers[selectedTab - 1]);
        }


        settingsTabs[currentSettingTab].classList.remove('btn-tab-select');
        this.classList.add('btn-tab-select');
        currentSettingTab = selectedTab;
        // new current tab set to clicked

        
    }
}


function switchFormValues( formName, timerObject){
    var minNew =  timerObject.time;
    if(minNew > 0){
        formName.elements.namedItem("settingsTime").value = minNew;
    }
    else{
        formName.elements.namedItem("settingsTime").value = '';
    }
    
    formName.elements.namedItem("settingsTag").value = timerObject.tag;
    formName.elements.namedItem("settingsDefault").checked = timerObject.defaultSound;
    var secNew = timerObject.seconds;
    if(secNew > 0){
        formName.elements.namedItem("settingsTimeSec").value = secNew;
    }
    else{
        formName.elements.namedItem("settingsTimeSec").value = '';
    }
    
  
    settingsDisables.forEach(function(element){
        if(timerObject.defaultSound){
            element.disabled = true;
        }
        else{
            element.disabled = false;
        }
    });
    
    
   switchAlerts(formName, timerObject);

    

}

function switchAlerts(formName, Obj){
    
    formName.elements.namedItem("settingsSound").value = Obj.soundType;
    formName.elements.namedItem("settingsVolume").value = Obj.volume;
}

function submitSettings(){
 
    if(!event.target.isValid){
        event.preventDefault();
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
        console.log(Timers[currentSettingTab-1]);
        Timers[currentSettingTab-1].tag = settingsForm.elements.namedItem("settingsTag").value;
        Timers[currentSettingTab-1].defaultSound = settingsForm.elements.namedItem("settingsDefault").checked;
        Timers[currentSettingTab-1].soundType = settingsForm.elements.namedItem("settingsSound").value;
        Timers[currentSettingTab-1].volume = settingsForm.elements.namedItem("settingsVolume").value;
        updateBtnDisplay(currentSettingTab-1);
        // show alert that saved
        settingsNot.classList.add("is-visible");
        setTimeout(function(){
            settingsNot.classList.remove("is-visible");
        },5000);
        saveSession();
    }
}

function resetSettings(){
    switchFormValues(settingsForm, Timers[currentSettingTab - 1]);
}



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
// Default Form 
// 
// 
// 
function resetDefault(){
    fillDefault();
}

function fillDefault(){
    switchAlerts(defaultForm, SettingsDefaults);
    defaultForm.elements.namedItem("autoLoop").checked = SettingsDefaults.autoLoop;
    fillLoopSetup();
}

function fillLoopSetup(){
    // fill in html with the default loops
    // for each in array loopQ
    // make group object html 
    // fill in data 
    // append in loop setup 

}

function submitDefault(){
    if(!event.target.isValid){
        event.preventDefault();

        
        
        SettingsDefaults.soundType = defaultForm.elements.namedItem("settingsSound").value;
        SettingsDefaults.volume = defaultForm.elements.namedItem("settingsVolume").value;

        SettingsDefaults.autoLoop = defaultForm.elements.namedItem("autoLoop").checked;

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

function playAlarm(timerObj){
    var audio;
    if(timerObj.defaultSound == true){
        audio = document.querySelector(`audio[data-sound = "${SettingsDefaults.soundType}"]`);
        audio.volume = SettingsDefaults.volume / 100;
    }
    else{
        audio = document.querySelector(`audio[data-sound = "${timerObj.soundType}"]`);
        audio.volume = timerObj.volume / 100;
    }
    
    audio.currentTime = 0;
    audio.play();
}


function testSound(){

    
    var testVol, testSoundType;
    if(event.target.classList.contains("modalTest")){
        testVol = customForm.elements["modalVolume"].value;
        testSoundType = customForm.elements["modalSound"].value;
    }
    else if(event.target.id == "defaultTest"){
        
        testVol = defaultForm.elements["settingsVolume"].value;
        testSoundType = defaultForm.elements["settingsSound"].value;
    }
    else{
        testVol = settingsForm.elements["settingsVolume"].value;
        testSoundType = settingsForm.elements["settingsSound"].value;
    }
    var testSoundObj ={
        soundType: testSoundType,
        volume:testVol,
        defaultSound: false
    }
    playAlarm(testSoundObj);
   return false;
}

// 
// 
// 
// Save Session Section 
// 
// 
// 

function saveSession(){
    sessionStorage.setItem('timers', JSON.stringify(Timers));
    sessionStorage.setItem('settings', JSON.stringify(SettingsDefaults));
}
function restoreSession(){
    console.log("here");
    Timers = JSON.parse(sessionStorage.getItem('timers'));
    SettingsDefaults = JSON.parse(sessionStorage.getItem('settings'));
    initQueue();
    // switch button labels
    for(i = 0; i < 3; i++){
        updateBtnDisplay(i);
    }
    if(Timers[3].on){
        customSelected = 3;
        updateBtnDisplay(3);
    }
    if(Timers[4].on){
        updateBtnDisplay(4);
    }
}