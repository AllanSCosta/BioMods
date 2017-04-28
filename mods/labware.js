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
var name = 'labware'

//
// initialization
//
var init = function() {
  mod.name = ''
  mod.type = 'trough-12row'
  mod.bcoords = {}
  mod.acoords = {}
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
      input.value = 'name'
      input.placeholder = 'name'
      input.size = 10
      input.addEventListener("change", function(){
        delete deck[mod.name]
        mod.name = this.value
        deck[mod.name] = {'labware': mod.type, 'bcoords' : mod.bcoords, 'acoords' : mod.acoords}
        outputs.tiprack.event();
      })
      div.appendChild(input)


  //
  // type
  //
    div.appendChild(document.createElement('br'))
    var input = document.createElement('input')
       input.type = 'name'
       input.value = 'trough-12row'
       input.placeholder = 'type'
       input.size = 10
       input.addEventListener("change", function(){
         delete deck[mod.name]
         mod.type = this.value
         deck[mod.name] = {'labware': mod.type, 'bcoords' : mod.bcoords, 'acoords' : mod.acoords}
         outputs.tiprack.event();
         acal.innerHTML = 'calibrate'
         bcal.innerHTML = 'calibrate'
       })
       div.appendChild(input)

  div.appendChild(document.createElement('br'))



//
// slot
//
  div.appendChild(document.createElement('br'))
  var input = document.createElement('input')
     input.type = 'name'
     input.value = 'A1'
     input.placeholder = 'slot'
     input.size = 10
     input.addEventListener("change", function(){
       mod.slot = this.value
       acal.innerHTML = 'calibrate'
       bcal.innerHTML = 'calibrate'
     })
     div.appendChild(input)

div.appendChild(document.createElement('br'))
div.appendChild(document.createElement('br'))

div.appendChild(document.createTextNode('A axis: '))
var btn = document.createElement('button')
   btn.style.padding = mods.ui.padding
   btn.style.margin = 1
   acal = document.createTextNode('calibrate')
   btn.appendChild(acal)
   btn.addEventListener('click',function(){
     calibrate(mod.name, mod.spot, 'a');
     acal.innerHTML = 'calibrated'
    })
   div.appendChild(btn)
 var btn = document.createElement('button')
    btn.style.padding = mods.ui.padding
    btn.style.margin = 1
    btn.appendChild(document.createTextNode('move'))
    btn.addEventListener('click',function(){
      move_to_container(mod.name, 'a');
     })
    div.appendChild(btn)
div.appendChild(document.createElement('br'))

div.appendChild(document.createTextNode('B axis: '))
var btn = document.createElement('button')
   btn.style.padding = mods.ui.padding
   btn.style.margin = 1
   bcal = document.createTextNode('calibrate')
   btn.appendChild(bcal)
   btn.addEventListener('click',function(){
     calibrate(mod.name, mod.spot, 'b');
     bcal.innerHTML = 'calibrated'
    })

   div.appendChild(btn)
 var btn = document.createElement('button')
    btn.style.padding = mods.ui.padding
    btn.style.margin = 1
    btn.appendChild(document.createTextNode('move'))
    btn.addEventListener('click',function(){
      move_to_container(mod.name, 'b');
     })
    div.appendChild(btn)


}


function calibrate(name, slot, axis) {
  var url = "http://localhost:31950/calibrate_position"
  var params = {"label" : name, 'slot': slot, 'axis': axis}
  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
  });
}


function move_to_container(name, slot, axis) {
  var url = "http://localhost:31950/move_to_container"
  var params = {"label" : name, 'slot': slot, 'axis': axis}
  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
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
