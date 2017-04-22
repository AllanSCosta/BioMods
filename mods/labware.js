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
         mod.type = input.value
         deck[mod.name] = {'labware': mod.type, 'bcoords' : mod.bcoords, 'acoords' : mod.acoords}
         outputs.tiprack.event();
       })
       div.appendChild(input)

  div.appendChild(document.createElement('br'))
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
