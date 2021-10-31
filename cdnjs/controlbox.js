var cbox_model = `
<div class="controlbox" style="position: fixed; z-index: 9999; left : 160px; top: 20px; background-color: black; height: 30px; valign: middle">
  <div class="button-group">
    <button type="button" id="button_play" class="btn">
      <i id="cbox_play" class="fa fa-play"></i>
    </button>
    <button type="button" id="button_stop" class="btn">
      <i class="fa fa-stop"></i>
    </button>
    <i id="noti" style="color:white"></i>
  </div>
</div>
`;
var CBOX_PLAYING = 0;
var CBOX_PAUSE = 1;
var CBOX_STOP = 2;
var cbox_play_state = CBOX_PLAYING;
var cbox_stop_state = false;
var cbox_state = CBOX_PLAYING;
var cbox_enable = false;

var logger_name = "AAAA";
var LOGGER_DEBUG = 2;
var LOGGER_INFO = 1;
var LOGGER_ERROR = 0;
var logger_lvl = LOGGER_INFO;


function playclick_action() {
    var newstate = CBOX_PLAYING;
    if(cbox_stop_state == true) {
        cbox_stop_state = false;
        newstate = CBOX_PLAYING
    } else if(cbox_play_state == CBOX_PLAYING) {
        newstate = CBOX_PAUSE;
    } else if(cbox_play_state == CBOX_PAUSE) {
        newstate = CBOX_PLAYING;
    } else {
        logger("Something unexpected", LOGGER_ERROR, false);
    }

    if(newstate == CBOX_PAUSE) {
        cbox_play_state = CBOX_PAUSE;
        cbox_state = CBOX_PAUSE;
        document.getElementById("cbox_play").classList.remove("fa-play");
        document.getElementById("cbox_play").classList.add("fa-pause");
        $('#noti').text("Paused");
    } else if(newstate == CBOX_PLAYING) {
        cbox_play_state = newstate;
        cbox_state = newstate;
        document.getElementById("cbox_play").classList.remove("fa-pause");
        document.getElementById("cbox_play").classList.add("fa-play");
        $('#noti').text("Playing...");
    }
}

function stopclick_action() {
    cbox_stop_state = true;
    cbox_state = CBOX_STOP;
    $('#noti').text("Stopped");
}


function cbox_is_playable() {
    if(!cbox_enable) {
        alert("Please enable cbox");
        return undefined;
    }
    if(cbox_state == CBOX_PLAYING) {
        $('#noti').text("OK, running the script");
        return true;
    }
    $('#noti').text("Script stopped");
    return false;
}

function register_cbox() {
   $("body").prepend(cbox_model);
   $("#button_play").click(playclick_action);
   $("#button_stop").click(stopclick_action);
    cbox_enable = true;
}

function logger(msg, lvl = 0, islist = false) {
    if(lvl <= logger_lvl) {
        $('#noti').text(msg);
        console.log(msg);
    }
}