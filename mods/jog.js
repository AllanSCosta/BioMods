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
var name = 'jog'

//
// initialization
//
var init = function() {
  mod.jog = 1
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
  div.appendChild(document.createTextNode('step size: '))
  input = document.createElement('input')
      input.type = 'number'
      input.size = 2
      input.value = 1
      input.addEventListener('change',function(evt){
        mod.jog = this.value
        })
      div.appendChild(input)


  //
  // up button
  //
  div.appendChild(document.createElement('br'))

  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('[X-Y]'))
  div.appendChild(document.createElement('br'))
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('↑')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'y': parseInt(mod.jog)})
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('←')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'x': -parseInt(mod.jog)})
      })
     div.appendChild(btn)


  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('↓')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'y': -parseInt(mod.jog)})
      })
     div.appendChild(btn)

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('→')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'x': parseInt(mod.jog)})
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))




  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('[Z]'))
  div.appendChild(document.createElement('br'))
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('↑')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'z': parseInt(mod.jog)})
      })
     div.appendChild(btn)

  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btntxt = document.createTextNode('↓')
     btn.appendChild(btntxt)
     btn.addEventListener('click',function(){
       move({'z': -parseInt(mod.jog)})
      })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))

  div.appendChild(document.createTextNode('[slot]'))
  div.appendChild(document.createElement('br'))

  cols = ["A", "B", "C", "D", "E"]
  rows = [3,2,1]

  for (var row = 0; row < rows.length; row++) {
    for (var col = 0; col < cols.length; col++){
      var btn = document.createElement('button')
         btn.style.padding = mods.ui.padding
         btn.style.margin = 1
         var slot = cols[col] + rows[row]
         btntxt = document.createTextNode(slot)
         btn.appendChild(btntxt)
         btn.addEventListener('click',function(){
           moveToSlot(this.innerHTML)
          })
         div.appendChild(btn)
    }
    div.appendChild(document.createElement('br'))
  }

  div.appendChild(document.createElement('br'))

}



function move(coords) {
  var url = "http://localhost:31950/jog"
  var params = coords
  $.ajax({
    type: "POST",
    dataType: "json",
    url: url,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
  });
}

function moveToSlot(slot) {
  var url = "http://localhost:31950/move_to_slot"
  var params = {"slot" : slot}
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
