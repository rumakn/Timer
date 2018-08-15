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
let settingsDefaults;
var customSelected, customForm;
var buttonsTime, settingsTabs;
var currentSettingTab, settingsForm, defaultForm;
var deleteTimer, settingsDisables, defaultCheckSet, defaultReset;
var currentTimer,btnsSoundTest;
var navbar,yoff;
var loopQueue, loopNum, indexLoop , loopLabel;
var stats, statsinfo, statsTable;
var statToday, statWeek, statTotal, hrLabel;

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
    
    statsTable = document.querySelector("#stats");
    statToday = document.querySelector("#statToday");
    statWeek = document.querySelector("#statWeek");
    statTotal = document.querySelector("#statTotal");
    hrLabel = document.querySelector("#HrLabel");

    settingsTabs = document.querySelectorAll(".SettingsTabs > button");
    
    settingsReset = document.querySelector("#resetSettings");

    btnsSoundTest = document.querySelectorAll(".testSound");
    
    loopLabel = document.querySelector("#LoopLabel");
    if(sessionStorage.length == 0){
        initTimers();
        initDefaults();
        initStats();
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
    initQueue();
}

function initQueue(){
    indexLoop = 0;
    loopQueue = [];
    loopNum = [];
    var loophold = 1;
    settingsDefaults.loopQ.forEach(function(element){
        for(i = 0 ; i < element.repeats; i++){
            loopQueue.push(...element.timers);
            for( j= 0; j < element.timers.length; j++){
                loopNum.push(loophold);
            }
            loophold ++;
        }
    });
    
    console.log(loopQueue);
    console.log(loopNum);
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
    window.location.hash= 'top';
}
function openModal(){
    modal.style.display = "block";
    window.location.hash= 'myModal';

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
        enableTimer(customSelected);
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
    
    if((currentSettingTab == 4 && settingsTabs[5].textContent === " + ") || (currentSettingTab == 5 && settingsTabs[4].textContent === " + ")){
        
            buttonsTime[4].disabled = true;
            buttonsTime[4].classList.add("btn-greyed");
    
            settingsTabs[5].disabled = true;
            settingsTabs[5].classList.add("btn-greyed");
       
    }

    buttonsTime[currentSettingTab-1].textContent = " + ";
    settingsTabs[currentSettingTab].textContent = " + ";
    
    Timers[currentSettingTab-1].on = false;
    disableTimer(currentSettingTab-1);
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
            setloopLabel(currentTimer.tag);
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
function setloopLabel(Labelnew){
    loopLabel.textContent = Labelnew;
}
function updateloopLabel(){

    loopLabel.textContent = "Loop : # " + loopNum[indexLoop] + " " + Timers[loopQueue[indexLoop]].tag;

}
function resetLoopIndex(){
indexLoop = 0;
updateloopLabel();
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
            
            var finTimer = addToStats(currentTimer.index);
            saveStats();
            addToTable(finTimer);
            


            if(settingsDefaults.autoLoop){

                if( loopQueue[indexLoop] == currentTimer.index ){
                    indexLoop++;
                    
                    if(indexLoop >= settingsDefaults.numTimers){
                        resetLoopIndex();
                        
                    }
                    
                    var indexNew = loopQueue[indexLoop];
                    
                    var TimeOBjNew = Timers[indexNew];
                    timeSet(TimeOBjNew.index);
                    
                }
                else{
                    resetLoopIndex();
                    timeSet(0);
                    
                }
                // set label function 
                updateloopLabel();
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
   
    const display = getFormattedTime(seconds);
    timer.textContent =  display;
    document.title = display;
} 

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
    switchAlerts(defaultForm, settingsDefaults);
    defaultForm.elements.namedItem("autoLoop").checked = settingsDefaults.autoLoop;
    fillLoopSetup();

    
}

function fillLoopSetup(){
    
    defaultForm.elements.namedItem("loopdrops_1").value = settingsDefaults.loopQ[0].timers[0];
    defaultForm.elements.namedItem("loopdrops_2").value = settingsDefaults.loopQ[0].timers[1];
    defaultForm.elements.namedItem("loopdrops_3").value = settingsDefaults.loopQ[1].timers[0];

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

function checkLoop(){
    var temp = defaultForm.elements.namedItem("loopdrops_1").value;
    console.log(temp);
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
function enableTimer(num){
    defaultForm.elements.namedItem("loopdrops_1").options[num].disabled = false;
    defaultForm.elements.namedItem("loopdrops_2").options[num].disabled = false;
    defaultForm.elements.namedItem("loopdrops_3").options[num].disabled = false;
}
function disableTimer(num){
    defaultForm.elements.namedItem("loopdrops_1").options[num].disabled = true;
    defaultForm.elements.namedItem("loopdrops_2").options[num].disabled = true;
    defaultForm.elements.namedItem("loopdrops_3").options[num].disabled = true;
}
function submitDefault(){
    if(!event.target.isValid){
        event.preventDefault();

        
        
        settingsDefaults.soundType = defaultForm.elements.namedItem("settingsSound").value;
        settingsDefaults.volume = defaultForm.elements.namedItem("settingsVolume").value;

        settingsDefaults.autoLoop = defaultForm.elements.namedItem("autoLoop").checked;

        Timers[defaultForm.elements.namedItem("loopdrops_1").value].tag;


        settingsDefaults.loopQ[0].timers[0] = defaultForm.elements.namedItem("loopdrops_1").value;
        settingsDefaults.loopQ[0].timers[1] = defaultForm.elements.namedItem("loopdrops_2").value;
        settingsDefaults.loopQ[1].timers[0] = defaultForm.elements.namedItem("loopdrops_3").value;

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
        audio = document.querySelector(`audio[data-sound = "${settingsDefaults.soundType}"]`);
        audio.volume = settingsDefaults.volume / 100;
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
// Session Section 
// 
// 
// 

function saveSession(){
    sessionStorage.setItem('timers', JSON.stringify(Timers));
    sessionStorage.setItem('settings', JSON.stringify(settingsDefaults));
}
function restoreSession(){
    console.log("here");
    Timers = JSON.parse(sessionStorage.getItem('timers'));
    settingsDefaults = JSON.parse(sessionStorage.getItem('settings'));
    loadStats();
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
    fillDefault();
}




// 
// 
// 
// Stats Section 
// 
// 
// 
function initStats(){
    stats = [];
    statsinfo = { /* will hold today, weekstart, total  */
        total : 0,
        todayTotal : 0,
        weekTotal : 0,
        num : 1
    };
    createToday();
    createWeekStart();
}

function addToStats(ind){
    var finTimer = {};
    finTimer.date = new Date();
    finTimer.tag = Timers[ind].tag;
    finTimer.time = (Timers[ind].time * 60 ) + Timers[ind].seconds;
    stats.push(finTimer);

    //check if work timer
    if(ind == 0){

        addTotals(ind, finTimer);
   

    } 

    

    return finTimer;
}

function saveStats(){
    sessionStorage.setItem('stats', JSON.stringify(stats));
    sessionStorage.setItem('statsinfo', JSON.stringify(statsinfo));
}
function loadStats(){
    stats = JSON.parse(sessionStorage.getItem('stats'));
    statsinfo = JSON.parse(sessionStorage.getItem('statsinfo'));
    // add all to table
    statsinfo.today = new Date(statsinfo.today);
    statsinfo.week = new Date(statsinfo.week);

    statsinfo.num = 1;
    for( i = 0; i < stats.length; i++){
        stats[i].date = new Date(stats[i].date);
        addToTable(stats[i]);
    }
    updateStatDisplay();
}
function addToTable(finishedTimer){
    console.log(statsinfo.num);
    var row = statsTable.insertRow(statsinfo.num);
    statsinfo.num ++;


    console.log(finishedTimer);
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = (finishedTimer.date.getMonth() + 1) + "/" + finishedTimer.date.getDate() + "/" + finishedTimer.date.getFullYear(); /* edit to show time in 12/12/12 format */
    cell2.innerHTML = finishedTimer.tag; 
    cell3.innerHTML = getFormattedTime(finishedTimer.time); /* edit to show min : seconds */
   

    // get totals in DOM
}

function createToday(){

    statsinfo.today = new Date();

}

function createWeekStart(){
    var tod = statsinfo.today;
    var shift = tod.getDay();
   
    statsinfo.week = new Date(tod.getYear(), tod.getMonth(), tod.getDate() - shift );
}

function addTotals(ind, finTimer){
    var compare = finTimer.date;
    
    // check if timer finished in the same day as stored today - update day total 
    if( compareDay(compare, statsinfo.today )){
        statsinfo.todayTotal += finTimer.time;
    }
    else{
        createToday();
        statsinfo.todayTotal = finTimer.time;
    }
    // check if timer finished in the same day as stored today - update week total
    if( compareDay(compare, statsinfo.week )){
        statsinfo.weekTotal += finTimer.time;
    }
    else{
        createToday();
        statsinfo.weekTotal = finTimer.time;
    }

    statsinfo.total += finTimer.time;

    updateStatDisplay();

   
}

function compareDay(day1, day2){
    return day1.getFullYear() === day2.getFullYear() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getDate() === day2.getDate();
}

function updateStatDisplay(){
// update under timer widget 
// update under stat title
    statToday.textContent = "Time Worked Today: " + getFormattedTime ( statsinfo.todayTotal );
    statWeek.textContent = "Time Worked This Week: " + getFormattedTime ( statsinfo.todayTotal );
    statTotal.textContent = "Total Time Worked: " + getFormattedTime ( statsinfo.todayTotal );
    hrLabel.textContent = "Time Worked Today: " + getFormattedTime ( statsinfo.todayTotal );
}