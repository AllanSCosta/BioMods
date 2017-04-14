//
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
var name = 'mix'

//
// initialization
//
var init = function() {
  mod.volume = 100
  mod.repetitions = 5
  mod.container = ""
  mod.location = "A1"
  mod.newtip = false
  mod.instructions = []
 }


//
// inputs
//
var inputs = {
  instrument:{
   type:'object',
   event:function(evt){
      mod.instructions = evt.detail
      outputs.instrument.event();
    }},
   container:{
   type:'string',
   event:function(evt){
      mod.container = evt.detail
      outputs.instrument.event();
    }},
}

//
// outputs
//
var outputs = {
  instrument:{
   type:'object',
   event:function(data){
   var gps_ln = mod.instructions[0]['groups'].length
   if (gps_ln == 0 || mod.newtip){
     gps_ln++;
     mod.instructions[0]['groups'].push({});
   }
   mix_obj = {}
   mix_obj['container'] = mod.container
   mix_obj['volume'] = mod.volume
   mix_obj['location'] = mod.location
   mix_obj['repetitions'] = mod.repetitions
   mod.instructions[0]['groups'][gps_ln - 1]['mix'] = [mix_obj]
   mods.output(mod, 'instrument', mod.instructions)
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
  // labware input
  //
  div.appendChild(document.createTextNode('location: '))
  input = document.createElement('input')
        input.type = 'text'
        input.placeholder = "location"
        input.value = "A1"
        input.size = 10
        input.addEventListener('change',function(evt){
          mod.port = this.value
          outputs.instrument.event();
          })
        div.appendChild(input)

  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('repetitions: '))
  input = document.createElement('input')
        input.type = 'text'
        input.placeholder = "repetitions"
        input.value = 5
        input.size = 10
        input.addEventListener('change',function(evt){
          mod.repetitions = this.value
          outputs.instrument.event();
          })
        div.appendChild(input)
  div.appendChild(document.createElement('br'))

  div.appendChild(document.createTextNode('volume: '))
  input = document.createElement('input')
        input.type = 'text'
        input.placeholder = "volume"
        input.value = 100
        input.size = 10
        input.addEventListener('change',function(evt){
          mod.volume = this.value
          outputs.instrument.event();
          })
        div.appendChild(input)

  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('new tip: '))
  input = document.createElement('input')
        input.type = 'checkbox'
        input.value = true
        input.addEventListener('change',function(evt){
          mod.newtip = this.checked;
          outputs.instrument.event();
          })
        div.appendChild(input)
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
