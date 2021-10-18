function load_script_no_cache(url) {
    url = url + "?v=" + get_random(1,1000000);
    return new Promise(function(resolve, reject) {
        var script = document.createElement("script");
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    });
}

function get_random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }