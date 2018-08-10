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
    initTimers();


    settingsTabs = document.querySelectorAll(".SettingsTabs > button");
    settingsSave = document.querySelector("#saveSettings");
    settingsReset = document.querySelector("#resetSettings");

    btnsSoundTest = document.querySelectorAll(".testSound");
    
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
    initDefaults();
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
        loopQ: [
            {
                order:1,
                timers: ["Work", "Short Break"],
                repeats: 4
            },
            {
                order:2,
                timers: ["Long Break"],
                repeats: 1
            }
        ],
        loops: 2
    };
}

function initTimers(){
    Timers = [
        {
            tag: "Work",
            time: 25,
            defaultSound: true,
            soundType: "ding", 
            volume: 80
        },
        {
            tag: "Short Break",
            time: 5,
            defaultSound: false,
            soundType: "elevator", 
            volume: 50
        },
        {
            tag: "Long Break",
            time: 10,
            defaultSound: true,
            soundType: "tone", 
            volume: 100
        },
        {
            tag: "Custom 1",
            time: 25,
            defaultSound: true,
            soundType: "bell", 
            volume: 100
        },
        {
            tag: "Custom 2",
            time: 25,
            defaultSound: true,
            soundType: "jingle", 
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

        Timers[customSelected].time = parseInt(modalTime.value);
        Timers[customSelected].tag = modalTag.value;
        Timers[customSelected].defaultSound = modalDefault.checked;
        Timers[customSelected].soundType = modalSound.value;
        Timers[customSelected].volume = parseInt(modalVolume.value);

        updateBtnDisplay(customSelected);

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

    buttonsTime[buttonNum].textContent = Timers[buttonNum].time + " min";
    settingsTabs[buttonNum + 1].textContent = Timers[buttonNum].tag + " Timer";
    console.log(buttonNum);
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
    
    settingsTabs[currentSettingTab-1].click();
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
        var seconds = Timers[index].time * 60;
        currentTime = seconds;
        startingTime = seconds;
        if(statusStart){
            timerFunc(currentTime);
        }
        else{
            displayTimeFormat(currentTime);
        }
        switchTitle(this);
        currentTimer = Timers[index];
        
    }
    
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
            playAlarm(currentTimer);
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
            switchFormValues(settingsForm, Timers[selectedTab - 1]);
        }


        settingsTabs[currentSettingTab].classList.remove('btn-tab-select');
        this.classList.add('btn-tab-select');
        currentSettingTab = selectedTab;
        // new current tab set to clicked

        
    }
}


function switchFormValues( formName, timerObject){

    formName.elements.namedItem("settingsTime").value = timerObject.time;
    formName.elements.namedItem("settingsTag").value = timerObject.tag;
    formName.elements.namedItem("settingsDefault").checked = timerObject.defaultSound;

    
  
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

        Timers[currentSettingTab-1].time = parseInt(settingsForm.elements.namedItem("settingsTime").value);
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