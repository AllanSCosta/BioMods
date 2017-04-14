//
// APA node module
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
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
var name = 'connect'

//
// initialization
//
var init = function() {
  mod.port = "COM4"
  mod.connected = false
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
  //
  // change parameters buttons
  //
  mod.div = div
  var program = ""
  var sel = document.createElement('select')
     sel.style.padding = mods.ui.padding
  //
  // port input
  //
  div.appendChild(document.createTextNode('port: '))
  input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      input.value = "COM4"
      input.addEventListener('change',function(evt){
        mod.port = input.value
        })
      div.appendChild(input)
  //
  // connect button
  //
  div.appendChild(document.createElement('br'))
  btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('connect')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       if (!mod.connected){
         connect(mod.port);
       } else {
         disconnect();
       }
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
  //
  // status
  //
  div.appendChild(document.createTextNode('status: '))
  status = document.createElement('p')
  status.innerHTML = "not connected"

}
function connect(port) {
  var url = "http://localhost:31950/robot/serial/connect"
  console.log('connecting')
  var params = {'port': port}
  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
    success: function(){
      mod.port = port;
      is_connected();
    }
  });
}
function disconnect(){
  var url = "http://localhost:31950/robot/serial/disconnect"
  console.log('disconecting')
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    success: function(){
      mod.port = "";
      is_connected();
    }
  });

}

function is_connected() {
  var url = "http://localhost:31950/robot/serial/is_connected"
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    success: function(data){
      mod.connected = data.is_connected;
      mod.port = data.port;
      if (mod.connected) {
        btntxt.innerHTML = "disconnect"
        status.innerHTML = "connected to " + mod.port;
      } else {
        btntxt.innerHTML = "connect"
        status.innerHTML = "disconnected"
      }
    }
  });
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
