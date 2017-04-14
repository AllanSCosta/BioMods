//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// closure
//
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'io-websocket'

//
// initialization
//
var init = function() {
  var s = document.createElement('script');
  s.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js");
  document.body.appendChild(s);
  var s = document.createElement('script');
  s.setAttribute('src', "https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js");
  document.body.appendChild(s);
}


//
// inputs
//
var inputs = {

}
//
// outputs
//
var outputs = {

}
//
// interface
//
var interface = function(div){

  mod.div = div
  var program = ""
  var sel = document.createElement('select')
     sel.style.padding = mods.ui.padding
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('Connect')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       connect();
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))


}

///////
// main function for http requests
//////

$jsonp = (function(){
  var that = {};
  that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = function(){
        console.log("timed!");
      },
      timeout = options.timeout || 10; // sec
    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
      on_timeout();
    }, timeout * 1000);
    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
      on_success(data);
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  return that;
})();



function connect() {
  var socket = io.connect('http://localhost:31950', {reconnect: true});
  console.log("connecting")
}

//
// return values
//
return ({
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
