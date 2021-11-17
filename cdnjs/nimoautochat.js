var $ = window.jQuery;
// var chatmsg_normal = ["Mọi người vào rom cho IDOL xin 1 cái follow nha ❤️",
//                "Hi everyone, welcome! Please also follow IDOL to be chilled with songs 😎",
//                "Mọi người vào chơi vui vẻ và nhớ follow nha ❤️❤️❤️",
//                "Thanks for joining this channel, please help to follow IDOL.You can also request songs",
//                "Cám ơn mọi người đã vào room nha, mọi người cho IDOL xin 1 follow ạ ❤️❤️❤️",
//                "Hi guys, you know we have a great idol here :) Don't hesitate to follow ^^",
//                "Mọi người yêu quý IDOL thì cho IDOL 1 follow ạ. Cám ơn mọi người",
//                "Hi, please help by following IDOL. Thanks so much ❤️",
//                "You feel sad? listen to the song. You feel happy 🥰? Follow and listen to many songs  ❤️❤️"
//               ];
var chatmsg_normal = ["Mọi người vào room có thể cho IDOL xin 1 trứng không?",
                     "IDOL đang xin trứng làm thử thách, mọi người giúp nha....",
                     "Thử thách 'mỗi quả trứng như 1 mũi tên xuyên vào thận của user top1'"]
var chatmsg_egg = ["Mọi người vào lụm trứng cho IDOL xin 1 follow chúc mọi người một ngày zui ze ❤️❤️❤️",
                   "Please follow the streamer, we have a lot of eggs will be given out you know?",
                   "Chúc mọi người lụm được kim cương nha, yêu mọi người ❤️",
                   "Hey, good luck guys. Don't forget to follow IDOL, you will have more luck for sure ❤️",
                   "Trứng còn nhiều, từ từ lụm và chớ quên follow nha người ơi 😝"];
                   
var chatmsg_offline = [ "Hi mọi người, IDOL sẽ live sớm thôi, cám ơn mọi người đã chờ",
                       "Chào mọi người, xíu xíu nữa là IDOL sẽ online nhé ❤️",
                       "IDOL sắp online rồi mọi người ơi....",
                       "Chỉ còn vài phút nữa thôi, mọi người chờ cùng em nhé"
                       ];

var cmd = {"!rl" : load_keywords, "!ks" : keywords_status, "!rs" : reload_stream};
var keywords;
var keywords_load_finished = false;
var msg_items;
var last_msg = "";
var kw_enable = true;
var prefix = "[🔥Bot] ";

var idols = {"922745114" : "MinHii🎹", "177713304" : "Vũ"};
var NG = "NOT_SUPPORT";
var MODE_EGG = "eggg";
var MODE_OFFLINE = "offline";
var MODE_NORMAL = "normal";
var msg_interval = 20000;
var chatmsg = {[MODE_OFFLINE]: chatmsg_offline, [MODE_EGG]: chatmsg_egg, [MODE_NORMAL]:  chatmsg_normal};
var timeintervals = {[MODE_OFFLINE]: 1*60*1000, [MODE_EGG]: 180000, [MODE_NORMAL]:  5*60*1000};

var reload_after_second = 1*60*60*1000; // Reload after 1 hour

$(document).ready(function(){
   register_cbox();
   load_keywords();
   msg_items = document.getElementsByClassName('nimo-room__chatroom__message-item');
   keyword_check();
   pause_stream();
   if(check_chatmsg_compability()) {
       main();
   }
});

function keywords_status() {
    if(keywords_load_finished) {
        console.log("Loaded finished");
    } else {
        console.log("Loading....");
    }
}

function reloadkw_callback() {

}

function load_keywords() {
    console.log("Start loading keywords...")
    keywords_load_finished = false;
    var http = new XMLHttpRequest;
    var url = "https://raw.githubusercontent.com/silverwolfceh/tamperscript/main/keywords.json";
    http.open("GET", url, !0);
    http.onreadystatechange = function() {
        if (4 == http.readyState && 200 == http.status) {
            var json_data = JSON.parse(http.responseText);
            keywords = json_data;
            keywords_load_finished = true;
            console.log("Finished loading keywords...")
			reloadkw_callback();
        }
    };
    http.send();
}
function reload_stream() {
    location.reload();
}
function pause_stream() {
    if(document.getElementsByClassName("nimo-icon nimo-icon-web-pause").length == 0) {
        setTimeout(pause_stream, 2000);
    } else {
        document.getElementsByClassName("nimo-icon nimo-icon-web-pause")[0].click();
    }
}

function get_welcome_msg(msg) {
    msg = msg.toLowerCase();
    if(msg in cmd) {
        cmd[msg]();
        return "";
    }
    if(msg in keywords) {
        return keywords[msg].replaceAll("IDOL", get_idol_id());
    } else {
        return "";
    }
}
function is_lastmessage_sent() {
    try {
        if(document.getElementsByClassName("nimo-room__chatroom__chat-box__input nimo-chat-box__input n-as-scroll c1")[0].value != '') {
            return false;
        }
    } catch (error) {
        console.log("Error in check the last message");
    }
    return true;
}
function keyword_check() {
    if(kw_enable) {
        if(cbox_is_playable()) {
            try{
                var msg = msg_items[msg_items.length-1].getElementsByClassName("n-as-vtm")[0].innerText;
                if(msg != last_msg) {
                    last_msg = msg;
                    var wlcm_msg = get_welcome_msg(last_msg);
                    if(wlcm_msg != "") {
			last_msg = wlcm_msg;
                        send_message(wlcm_msg, "WELCOME MSG");
                    }
                }
            } catch (error) {
                console.log("Errror");
            }
        }
        setTimeout(keyword_check, 1000);
    }
}

function check_chatmsg_compability() {
    var result = true;
    var check_arr = [chatmsg_normal, chatmsg_egg, chatmsg_offline];
    var i = 0, j = 0;
    var total_len = 0;
    for(i = 0; i < check_arr.length; i++) {
        var chatmsg = check_arr[i];
        for(j = 0; j < chatmsg.length; j++) {
            var msg = chatmsg[j];
            total_len = msg.length + prefix.length;
            if(total_len >= 100) {
                console.log("Msg len " + total_len + " is not support: " + msg);
                result = false;
            }
        }
    }
    return result;
}

function get_chat_msg(whatmode) {
    var idx = Math.floor(Math.random() * whatmode.length);
    return whatmode[idx];
}

function get_idol_id() {
    var stream_url = document.location.href;
    var id = stream_url.split("/live/")[1].split("?")[0];
    console.log(id);
    if(id in idols) {
        return idols[id];
    }
    return NG;
}



function egg_avaiable() {
    if(document.getElementsByClassName("nimo-box-gift__box__cd").length == 0) {
        return false;
    } else {
        return true;
    }
}

function is_idol_offline() {
    if(document.getElementsByClassName("nimo-anchor-broadcast-game nimo-rm_type n-fx0 n-as-mrgh c2").length > 0) {
        var data = document.getElementsByClassName("nimo-anchor-broadcast-game nimo-rm_type n-fx0 n-as-mrgh c2")[0].innerText;
        if(data.indexOf("ago streamed") != -1 || data.indexOf("đã live stream") != -1) {
            return true;
        }
    }
    return false;
}

function get_mode() {
    if(egg_avaiable()) {
        return MODE_EGG;
    }
    if(is_idol_offline()) {
        return MODE_OFFLINE;
    }
    return MODE_NORMAL;
}

function change_interval(mode) {
    msg_interval = timeintervals[mode];
}

function send_message(msg, idol_name) {
    try {
        document.getElementsByClassName("nimo-room__chatroom__chat-box__input nimo-chat-box__input n-as-scroll c1")[0].value = msg;
        document.getElementsByClassName("nimo-btn nimo-chat-box__send-btn n-fx0 nimo-btn-secondary")[0].click();
        logger("Sending auto message for IDOL " + idol_name, LOGGER_INFO);
        return true;
    } catch (error) {
        
    }
    return false;
}

function run_work() {
    var idol_name = get_idol_id();
    if(idol_name == NG) {
        logger("The idol aren't activated in tool", LOGGER_ERROR);
        return false;
    }
    var mode = get_mode();
    var msg = get_chat_msg(chatmsg[mode]);
    change_interval(mode);
    msg = msg.replaceAll("IDOL", idol_name);
    msg = prefix + msg;
    if(mode != MODE_OFFLINE) {
        send_message(msg, idol_name);
    } else {
        
    }
}

function main() {
    if(cbox_is_playable()) {
        run_work();
        setTimeout(main,msg_interval);
    } else {
        setTimeout(main, 1000);
    }
}

