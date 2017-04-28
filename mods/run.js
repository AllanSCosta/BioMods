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
var name = 'run'

//
// initialization
//
var init = function() {
  mod.upload = {}
 }
//
// inputs
//
var inputs = {
  instrument:{
   type:'object',
   event:function(evt){
      mod.instructions = evt.detail
      mod.upload['head'] = head
      mod.upload['deck'] = deck
      mod.upload['instructions'] = mod.instructions
    }}
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
  // upload button
  //
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('upload protocols'))
     btn.addEventListener('click',function(){
       upload_protocols()
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))
  //
  // upload button
  //
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('run protocols'))
     btn.addEventListener('click',function(){
       run();
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
}

//Local Functions
function upload_protocols() {

  var file = new File([JSON.stringify(mod.upload)], "upload.json", {type:"text/plain", lastModified: new Date().getTime()});

  var url = "http://localhost:31950/upload"

  var formData = new FormData();
  formData.append("file", file);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  console.log(JSON.stringify(mod.upload))
  xhr.send(formData);  // multipart/form-data

}

function run(){
  setTimeout(function(){
    var root = "http://localhost:31950/run"
    $jsonp.send(root, {
          callbackName: 'handleStuff',
          onSuccess: function(json){
              console.log("running");
              clearInterval(request);
          },
          timeout: 15
      });
    }, 5000)
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
