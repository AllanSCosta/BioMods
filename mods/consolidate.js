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
var name = 'consolidate'

//
// initialization
//
var init = function() {
  mod.volume = 100
  mod.range_start = 0
  mod.range_end = 1
  mod.source_container = ""
  mod.target =  {"touch-tip": true}

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
   source:{
   type:'string',
   event:function(evt){
      mod.source_container = evt.detail
      outputs.instrument.event();
    }},
    target:{
    type:'string',
    event:function(evt){
       mod.target['container'] = evt.detail
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
   if (gps_ln == 0 || newtip){
     mod.instructions[0]['groups'].push({})
     gps_ln++;
   }

   consolidate = {"blowout" : true}

   consolidate['from'] = []
   for (var i = mod.range_start; i <= mod.range_end; i++) {
     consolidate['from'].append({
        "container": mod.source_container,
        "location": i,
        "volume" : mod.volume,
        "touch-tip" : true
     })
   }
   consolidate['to'] = mod.target

   mod.instructions[0]['groups'][gps_ln - 1]['consolidate'] = consolidate
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
  // source and taget loci
  //
  div.appendChild(document.createTextNode('source range: '))
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('from '))
  input = document.createElement('input')
        input.type = 'number'
        input.style = 'width: 3em'
        input.value = 0
        input.size = 3
        input.addEventListener('change',function(evt){
          mod.range_start = this.value;
          outputs.instrument.event();
          })
        div.appendChild(input)


  div.appendChild(document.createTextNode(' to '))
  input = document.createElement('input')
        input.type = 'number'
        input.style = 'width: 3em'
        input.value = 1
        input.size = 3
        input.addEventListener('change',function(evt){
          mod.range_end = this.value;
          outputs.instrument.event();
          })
        div.appendChild(input)


  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('target locus: '))
  input = document.createElement('input')
        input.type = 'text'
        input.value = "A1"
        input.size = 10
        input.addEventListener('change',function(evt){
          mod.target['location'] = this.value
          outputs.instrument.event();
          })
        div.appendChild(input)




  //
  // volume
  //
  div.appendChild(document.createElement('br'))
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
