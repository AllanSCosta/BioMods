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
var name = 'pipette'

//
// initialization
//
var init = function() {
  mod.pipette = {}
  if (typeof head == "undefined") { head = {} }
  mod.name = ""
  mod.pipette["tip-racks"] = [{"container" : ""}]
  mod.pipette["trash-container"] = {"container": ""}
  mod.pipette["multi-channel"] = false
  mod.pipette["axis"] = "b"
  mod.pipette["volume"] = 200
  mod.pipette["down-plunger-speed"] = 300
  mod.pipette["up-plunger-speed"] = 500
  mod.pipette["tip-plunge"] = 8
  mod.pipette["extra-pull-volume"] = 20
  mod.pipette["extra-pull-delay"] = 0.2
  mod.pipette["distribute-percentage"] = 0.1
  mod.pipette["points"] = [
			{
				"f1" : 10,
				"f2" : 6
			},
			{
				"f1" : 25,
				"f2" : 23
			},
			{
				"f1" : 50,
				"f2" : 49
			},
			{
				"f1" : 200,
				"f2" : 200
			}
		]
 }
//
// inputs
//
var inputs = {
  "tip rack":{
  type:'string',
  event:function(evt){
    mod.pipette["tip-racks"] = [{"container" : evt.detail}]
  }},
  "trash container":{
  type:'string',
  event:function(evt){
    mod.pipette["trash-container"] = {"container": evt.detail}
   }}
 }
//
// outputs
//
var outputs = {
  pipette:{
   type:'object',
   event:function(data){
      mods.output(mod, 'pipette', [{'tool': mod.name, 'groups': []}])
    }}
  }
//
// interface
//
var interface = function(div){
  //
  // change parameters buttons

  mod.div = div
  var program = ""
  var sel = document.createElement('select')
     sel.style.padding = mods.ui.padding

 div.appendChild(document.createTextNode('name: '))
 var input = document.createElement('input')
     input.type = 'text'
     input.size = 7
     input.addEventListener('change',function(evt){
       if (mod.name in head) { delete head[mod.name] }
       mod.name = this.value
       })
     div.appendChild(input)

 div.appendChild(document.createElement('br'))
 div.appendChild(document.createTextNode('tip-racks: '))
 var input = document.createElement('input')
     input.type = 'text'
     input.size = 7
     input.value = "p200-rack"
     input.addEventListener('change',function(evt){
       mod.pipette["tip-racks"] = [{"container": this.value}]
       })
     div.appendChild(input)
 div.appendChild(document.createElement('br'))


 div.appendChild(document.createTextNode('trash-container: '))
 var input = document.createElement('input')
     input.type = 'text'
     input.size = 7
     input.value = "trash"
     input.addEventListener('change',function(evt){
       mod.pipette["trash-container"] = {"container" : this.value}
       })
     div.appendChild(input)


   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode("multi-channel: "))
   var input = document.createElement('input')
       input.type = 'checked'
       input.size = 5
       input.value = false
       input.addEventListener('change',function(evt){
         mod.pipette['multi-channel'] = this.checked;
         })
       div.appendChild(input)


   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode("axis: "))
   var input = document.createElement('input')
       input.type = 'text'
       input.size = 4
       input.value = "a"
       input.addEventListener('change',function(evt){
         mod.pipette["axis"] = this.value
         })
       div.appendChild(input)

   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode("volume: "))
   var input = document.createElement('input')
       input.type = 'number'
       input.size = 4
       input.value = 200
       input.addEventListener('change',function(evt){
         mod.pipette["volume"] = this.value
         })
       div.appendChild(input)

   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode("down-plunger-speed: "))
   var input = document.createElement('input')
       input.type = 'number'
       input.value = 300
       input.size = 4
       input.addEventListener('change',function(evt){
         mod.pipette["down-plunger-speed"] = this.value
         })
       div.appendChild(input)

    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode("up-plunger-speed: "))
    var input = document.createElement('input')
        input.type = 'number'
        input.value = 500
        input.size = 4
        input.addEventListener('change',function(evt){
          mod.pipette["up-plunger-speed"] = this.value
          })
        div.appendChild(input)



   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode("tip-plunge: "))
   var input = document.createElement('input')
       input.type = 'number'
       input.value = 8
       input.size = 4
       input.addEventListener('change',function(evt){
         mod.pipette["tip-plunge"] = this.value
         })
       div.appendChild(input)

    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode("extra-pull-volume: "))
    var input = document.createElement('input')
        input.type = 'number'
        input.size = 4
        input.value = 20
        input.addEventListener('change',function(evt){
          mod.pipette["extra-pull-volume"] = this.value
          })
        div.appendChild(input)

    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode("extra-pull-delay: "))
    var input = document.createElement('input')
        input.type = 'number'
        input.value = 0.2
        input.size = 4
        input.addEventListener('change',function(evt){
          mod.pipette["extra-pull-delay"] = this.value
          })
        div.appendChild(input)

    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode("distribute-percentage: "))
    var input = document.createElement('input')
        input.type = 'number'
        input.value = 0.1
        input.size = 4
        input.addEventListener('change',function(evt){
          mod.pipette["distribute-percentage"] = this.value
          })
        div.appendChild(input)

  //
  // build button
  //
  div.appendChild(document.createElement('br'))
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('start workflow'))
     btn.addEventListener('click',function(){
       build_pipette();
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
}


function build_pipette(){
 head[mod.name] = {}
 head[mod.name] = mod.pipette
 head[mod.name]['tool'] = 'pipette'
 outputs.pipette.event()
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
