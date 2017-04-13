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
var name = 'tiprack-200ul'

//
// initialization
//
var init = function() {
  mod.name = ""
  if (typeof deck == "undefined") { deck = {} }
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
  tiprack:{
   type:'string',
   event:function(data){
      mods.output(mod,'tiprack', mod.name)
    }}
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
   // name
   //
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'name'
      input.placeholder = 'name'
      input.size = 7
      input.addEventListener("change", function(){
        delete deck[mod.name]
        mod.name = this.value
        deck[mod.name] = {'labware': 'tiprack-200ul'}
        outputs.tiprack.event();
      })
      div.appendChild(input)

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('calibrate'))
     div.appendChild(btn)
     btn.addEventListener('click', function(){
       var url = "http://localhost:31950/calibrate_placeable"
       var params = {'label': mod.name, 'axis': 'b'}
       $.ajax({
         type: "POST",
         dataType: "json",
         url: url,
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(params),
         success: function(){
           console.log('calibrated')
         }
       });
      })
  div.appendChild(document.createElement('br'))
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
