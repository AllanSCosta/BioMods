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
  mod.name = 'trough'
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
      input.addEventListener("input", function(){
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
       input.addEventListener("input", function(){
         delete deck[mod.name]
         mod.type = input.value
         deck[mod.name] = {'labware': mod.type, 'bcoords' : mod.bcoords, 'acoords' : mod.acoords}
         outputs.tiprack.event();
       })
       div.appendChild(input)

  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))

 ////
 // calibration & movement
 ////

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('calibrate A'))
     div.appendChild(btn)
     btn.addEventListener('click', function(){
       calibrate(mod.name,'a');
      })


  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('A'))
     div.appendChild(btn)
     btn.addEventListener('click', function(){
       move_to_container(mod.name, 'a');
      })
  div.appendChild(document.createElement('br'))


  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('calibrate B'))
     div.appendChild(btn)
     btn.addEventListener('click', function(){
       calibrate(mod.name,'b');
      })

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('B'))
     div.appendChild(btn)
     btn.addEventListener('click', function(){
       move_to_container(mod.name, 'b')
      })
  div.appendChild(document.createElement('br'))


}

//
// helper functions
//

function calibrate(name, axis) {
  var url = "http://localhost:31950/robot/get_coordinates"
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    success: function(coords){
      coords = coords['coords']
      console.log(coords)
      // coords['x'] = -coords['x']
      // coords['z'] = -coords['z']
      mod[axis + 'coords'] = coords
    }
  })
}

function move_to_container(name, axis) {
  var url = "http://localhost:31950/move_absolute"
  var this_coords = axis + 'coords'

  var params = mod[this_coords]

  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
    success: function(){
      console.log('moving to ' + name);
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
