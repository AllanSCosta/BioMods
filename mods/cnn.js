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
var name = 'cnn'

//
// initialization
//
var init = function() {
  mod.filter_size = 10
  mod.data = {}
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
  //
  // file input control
  //
  var file = document.createElement('input')
     file.setAttribute('type','file')
     file.setAttribute('id',div.id+'file_input')
     file.style.position = 'absolute'
     file.style.left = 0
     file.style.top = 0
     file.style.width = 0
     file.style.height = 0
     file.style.opacity = 0
     file.addEventListener('change',function() {
        json_read_handler()
        })
     div.appendChild(file)
     mod.file = file
  //
  // modify the filter size
  //
  div.appendChild(document.createTextNode('filter size: '))
  input = document.createElement('input')
     input.type = 'text'
     input.size = 3
     input.value = 10
     input.addEventListener('keydown',function(evt){
       mod.filter_size = input.value
     })
     div.appendChild(input)
  div.appendChild(document.createElement('br'))
  //
  // off-screen image canvas
  //
  var canvas = document.createElement('canvas')
     mod.img = canvas
  //
  // file select button
  //
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('select json file'))
     btn.addEventListener('click',function(){
        var file = document.getElementById(div.id+'file_input')
        file.value = null
        file.click()
        })
     div.appendChild(btn)
  div.appendChild(document.createElement('br'))
  //
  // view button
  //
  var btn = document.createElement('button')
     btn.style.padding = mods.ui.padding
     btn.style.margin = 1
     btn.appendChild(document.createTextNode('view'))
     btn.addEventListener('click',function(){
        var win = window.open('')
        var btn = document.createElement('button')
           btn.appendChild(document.createTextNode('close'))
           btn.style.padding = mods.ui.padding
           btn.style.margin = 1
           btn.addEventListener('click',function(){
              win.close()
              })
           win.document.body.appendChild(btn)
        var txt_div = document.createElement('p')
           txt_div.style.width = '600px'
           txt_div.style.position = 'absolute'
           txt_div.style.left = '275px'
           txt_div.style.top = '750px'
           txt_div.style.textAlign = 'center'
        var text = document.createElement('p')
           text.id = "sequence_p"
           text.style.wordWrap = 'break-word'
           text.style.fontFamily = "Orator Std Medium"
           txt_div.appendChild(text)
           win.document.body.appendChild(txt_div)
        win.document.body.appendChild(document.createElement('br'))
        neural_network(mod.data, mod.size_filter, win.document.body);
        })
     div.appendChild(btn)
  div.appendChild(document.createTextNode(' '))
}

//
// Local Functions
//
// JSON processing functions
//
function json_read_handler(event) {
   var file_reader = new FileReader()
   file_reader.onload = json_handler
   input_file = mod.file.files[0]
   file_name = input_file.name
   file_reader.readAsText(input_file)
   }

function json_handler(event) {
   var lines = event.target.result;
   var data = JSON.parse(lines);
   mod.data = data;
}


//
// neural network visualization helper functions
//

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function randomColorGenerator(n) {
    var colors   = ["#B0BEC5", "#C5E1A5", "#81D4FA",
                    "#FFF59D", "#A5D6A7", "#ef9a9a",
                    "#E6EE9C", "#FFAB91", "#90CAF9",
                    "#F48FB1", "#9FA8DA", "#FFCC80",
                    "#80CBC4", "#CE93D8", "#B39DDB",
                    "#80DEEA", "#FFE082"];
    return colors[n % colors.length];
}

var weightsSign = function (weights) {
    if (weights < 0) {
        return -weights;
    } else {
        return 0.1;
    }
}


//
// neural network visualization
//


function neural_network(data, filter_size, body){

  // parsing information from JSON
  var weights = data.out_weights,
      biases = data.out_biases,
      filter_matches = data.input_matches,
      filter_size = data.filter_size,
      neurons_by_layer = [];


  for (var i = 0; i < weights.length; i++) {
      neurons_by_layer.push(0);
      for (var j = 0; j < weights[i].length; j++) {
          neurons_by_layer[i]++;
      }
      if (i == weights.length - 1) {
          neurons_by_layer.push(0);
          neurons_by_layer[i + 1] = weights[i][0].length;
      }
  }


      //
      // parameters for visualization
      //
      // information from datafeed
  var first_row_size = neurons_by_layer[0],
      number_of_neurons = 0,
      neurons_at_last_layer = neurons_by_layer[neurons_by_layer.length - 1],
      threshold = 0.98,
      biggest_layer = getMaxOfArray(neurons_by_layer),
      neuron_chain,
      filter_matches_index = 0,
      selected_color = "white",
      letters = ["A", "C", "G", "T"],
      letter_colors = ["#66BB6A", "#2196F3",
                       "#FFEE58", "#E57373"],

      // visualization parameters
      radius = 102.5 * Math.pow(biggest_layer, -0.78),
      padding = 800 / biggest_layer,
      opacity_base = biggest_layer / 4,
      hidden_node_opacity = 0.6,
      node_hover_radius = 12,
      hidden_opacity_base = Math.pow(opacity_base, 1 / 30),
      hidden_opacity = Math.pow(0.1, hidden_opacity_base),
      link_value_exp = 6,
      link_radius_exp = 1.6,
      label_scale = 0.195,

      //layout/interface data
      units = "Widgets",
      margin = {
          top: 150,
          right: 450,
          bottom: 150,
          left: 550
      },
      total_width = 1500,
      total_height = 1000,
      width = 1500 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;


  // processing data to prepare for sankey.js
  var neuron_index = 0,
      network = [],
      network_chain = [];

  for (var i = 0; i < neurons_by_layer.length; i++) {
      network[i] = [];
      for (var j = 0; j < neurons_by_layer[i]; j++) {
          number_of_neurons++;
          if (neuron_index > first_row_size) {
              network[i].push({
                  "node": neuron_index,
                  "bias": biases[i - 1][j]
              });
          } else {
              network[i].push({
                  "node": neuron_index
              });
          }
          network_chain.push({
              "node": neuron_index
          });
          neuron_index++;
      }
      var last_layer_index = number_of_neurons - neurons_at_last_layer;
  }

  var connections = [];
  for (var i = 0; i < (network.length - 1); i++) {
      for (var j = 0; j < network[i].length; j++) {
          for (var k = 0; k < network[i + 1].length; k++) {
              connections.push({
                  "source": network[i][j]["node"],
                  "target": network[i + 1][k]["node"],
                  "value": weightsSign(weights[i][j][k]),
                  "boolean": weights[i][j][k] < network[i + 1][k]["bias"] - 0.5
              });
          }
      }
  }

  var graph = {
      "nodes": network_chain,
      "links": connections
  };

  var svg = d3.select(body).append("svg").attr("id", "sankey")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform",
          "rotate(-90 " + total_width / 2 + " " + total_height / 2 + ")")
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + 0 + ")");

  d3.select(body).select("#sequence_p").text(filter_matches[0][0]);
  var sankey = d3.sankey()
      .nodeWidth(40)
      .width(width)
      .nodePadding(padding)
      .size([width, height]);
  var path = sankey.link();
  sankey
      .lastrow(neurons_at_last_layer)
      .nodeRadius(radius)
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

  var link = svg.append("g").attr("id", "links").selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .filter(function (d) {
          return d.boolean;
      })
      .attr("class", function (d) {
          if (d.boolean) {
              return "link_" + d.source.node + " link";
          }
      })
      .attr("id", function (d) {
          if (d.boolean) {
              return "link_" + d.target.node
          }
      })
      .style({
          "opacity": hidden_opacity,
          "fill": "none",
          "stroke": "#606060",
          "z-index": "-1"
      })
      .attr("d", path)
      .style("opacity", hidden_opacity)
      .style("stroke-width", function (d) {
          return Math.pow(d.value, link_value_exp) * Math.pow(radius, link_radius_exp);
      })

  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
      })


  var stroke_width = radius / 3;
  node.append("circle")
      .attr("r", radius)
      .style("fill", "transparent")
      .style("stroke", "darkgray")
      .attr("id", function (d) {
          return "node_" + d.node
      })
      .style("stroke-width", stroke_width)

  var links = [];
  var nodes = [];
  var chain = [];

  link.each(function (d) {
      links.push(d);
  })
  node.each(function (d) {
      nodes.push(d)
  })

  var sequence_logo = [];
  node.each(function (d) {
      chain = [];
      getUpperChain(d.node, chain);
      getLowerChain(d.node, chain);
      d.chain = chain;
      neuron_index = d.node - last_layer_index + 1;
      if (neuron_index > 0) {
          if (neuron_index % letters.length == 1) {
              var graph_column = [];
              var sum = 0
              for (var i = d.node; i < d.node + letters.length; i++) {
                sum += nodes[i]['value']
              }
              var entropy = 0
              for (var i = d.node; i < d.node + letters.length; i++) {
                entropy += nodes[i]['value'] * Math.log2(nodes[i]['value'])
              }
              var scale = 2 - entropy;
              for (var i = d.node; i < d.node + letters.length; i++) {
                graph_column.push({
                  letter: letters[i % letters.length],
                  bits: scale * nodes[i]['value'] / sum,
                  node: i
                })
              }
              sequence_logo.push(graph_column);
          }
      }
  })


  // Set up Sequence Logo
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
  var y = d3.scale.linear()
      .range([height, 0]);
  var labels = d3.scale.linear()
      .range([height * label_scale, 0]);
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom").ticks(0);
  var yAxis = d3.svg.axis()
      .scale(labels)
      .orient("left")
      .ticks(5);


  // more bit-valued letters are above
  for (var col = 0; col < sequence_logo.length; col++) {
      sequence_logo[col].sort(function (a, b) {
          return d3.ascending(a.bits, b.bits);
      });
  }

  sequence_logo.forEach(function (d) {
      var y0 = 0;
      d.bits = d.map(function (entry) {
          return {
              bits: entry.bits,
              letter: entry.letter,
              node: entry.node,
              y0: y0,
              y1: y0 += +entry.bits
          };
      })
      d.bitTotal = d.bits[d.bits.length - 1].y1;
  });
  x.domain(sequence_logo.map(function (d, i) {
      return i;
  }));
  var maxBits = d3.max(sequence_logo, function (d) {
      return d.bitTotal
  });

  y.domain([0, maxBits]);
  labels.domain([0, 2]);


  // manual translation & manual height setting
  // for fitting within the page layout
  var sq_logo = svg.append("g")
      .attr("transform",
      "rotate(90) translate(135, -623) scale(" + neurons_at_last_layer / 30 + ", 1)")
  sq_logo.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height * 0.2 + ")")
      .call(xAxis);
  sq_logo.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Bits");


  var column = sq_logo.selectAll(".column")
      .data(sequence_logo)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
          return "translate(" + (x(i) + (x.rangeBand() / 2)) + ",0)";
      })
      .attr("class", "column");

  // approximation to bring cap-height to full font size
  var capHeightAdjust = 1.6;
  column.selectAll("text")
      .data(function (d) {
          return d.bits;
      })
      .enter()
      .append("text")
      .attr("y", function (e) {
          return y(e.y0) * 0.2;
      })
      .text(function (e) {
          return e.letter;
      })
      .attr("class", function (e) {
          return "letter-bp letter-" + e.letter;
      })
      .attr("id", function (e) {
          return "bp_" + e.node;
      })
      .style("text-anchor", "middle")
      .style("font-family", "Orator Std Medium")
      .style("pointer-events", "none")
      .attr("textLength", x.rangeBand() * 0.7)
      .attr("lengthAdjust", "spacingAndGlyphs")

      // font sized for fitting
      .attr("font-size", function (e) {
          return (y(e.y0) - y(e.y1)) * 0.18 * capHeightAdjust;
      })
      .style("font-size", function (e) {
          return (y(e.y0) - y(e.y1)) * 0.18 * capHeightAdjust;
      });

  d3.select(body)
    .selectAll(".tick")
    .attr("visibility","hidden");
  // color the letters
  for (var lttr = 0; lttr < letters.length; lttr++){
    column.selectAll(".letter-" + letters[lttr]).style("fill", letter_colors[lttr])
  }


  var tool_index,
      tool_text,
      bef_text,
      high_text,
      aft_text;

  d3.select(body).selectAll("circle")
      .on("mouseenter", nodeMouseEnter)
      .on("click", nodeClick)
      .on("mouseout", nodeMouseOut)

  // Recursive function to get the chain of nodes that connect to @param node
  // from the lower part of the graph
  function getLowerChain(node, chain) {
      chain.push(node);
      for (var i = 0; i < links.length; i++) {
          if (links[i].target.node == node && links[i].boolean) {
              var source_node = links[i].source.node;
              getLowerChain(source_node, chain);
          }
      }
  }
  // Recursive function to get the chain of nodes that connect to @param node
  // from the upper part of the graph
  function getUpperChain(node, chain) {
      chain.push(node);
      for (var i = 0; i < links.length; i++) {
          if (links[i].source.node == node && links[i].boolean) {
              var target_node = links[i].target.node;
              getUpperChain(target_node, chain);
          }
      }
  }

    function nodeMouseOut(d) {
          d3.select(body).select("#tooltip").attr("class", "hidden");
          if (neuron_chain) {
              if (neuron_chain.indexOf(d.node) < 0) {
                  d3.select(this)
                    .attr("r", radius)
                    .style("opacity", 1)
                    .style("fill", "transparent");
              } else {
                  d3.select(this)
                  .attr("r", 9)
                  .style("opacity", hidden_node_opacity)
                  .style("fill", selected_color);
              }
          } else {
              d3.select(this)
              .attr("r", radius)
              .style("opacity", 1)
              .style("fill", "transparent");
          }
          // For future implementations
          // d3.select(body).select("#sqlogo_hover")
          //     .attr("src", "sq_img/none.png")
      }


  function nodeMouseEnter(d) {
      if (d.node < (number_of_neurons - neurons_at_last_layer)) {
          selected_color = d3.select(this).style("fill");

          d3.select(this)
            .attr("r", node_hover_radius)
            .style("opacity", hidden_node_opacity)
            .style("fill", "white")

          var top = d3.event.pageY - 140 + "px";
          var left = d3.event.pageX - 65 + "px";

          d3.select("#tooltip")
            .style("margin-top", top)
            .style("margin-left", left)
            .attr("class", "");

          tool_text = filter_matches[d.node][0];
          tool_index = filter_matches[d.node][1];

          bef_text = tool_text.substring(tool_index - 100, tool_index);
          high_text = tool_text.substring(tool_index, tool_index + filter_size);
          aft_text = tool_text.substring(tool_index + filter_size, tool_index + 100 + filter_size);

          d3.select("#bef_span").text(bef_text);
          d3.select("#tooltip_span").text(high_text)
                                    .style('opacity', 5 * Math.pow(filter_matches[d.node][2], 5));
          d3.select("#aft_span").text(aft_text);

          // future implementations
          // d3.select("#sqlogo_hover")
          //     .attr("src", function () {
          //         return "sq_img/" + d.node + ".png";
          //     })
      }
  }




  var sequence_fragment = d3.select(body).select("#sequence_p").text();

  $("#sq_id").on("change", function(){

      filter_matches_index = $(this).val() - 1;

      d3.select(body)
        .select("#sequence_p")
        .text(filter_matches[filter_matches_index][0]);

      sequence_fragment = d3.select(body)
      .select("#sequence_p")
      .text();


      var node_id = "#node_" + neuron_chain[0];
      d3.select(body).select(node_id).each(nodeClick)
  })

  function nodeClick(d) {
      if (neuron_chain) {
          d3.select(body)
            .selectAll("image")
            .style("opacity", 0);

          d3.select(body)
            .selectAll(".letter-bp")
            .style("filter", "grayscale(0%)")
            .style("opacity", hidden_node_opacity/2)
            .style("-webkit-filter", "grayscale(0%)");

          $(".letter-bp").removeClass("letter-highlight")

          d3.select(body)
            .select("#node_" + neuron_chain[0])
            .attr("r", radius)
            .style("opacity", 1)
            .style("fill", "transparent")

          for (var i = 0; i < neuron_chain.length; i++) {

              var link_id = "#link_" + neuron_chain[i];
              var link_class = ".link_" + neuron_chain[i];
              var node_id = "#node_" + neuron_chain[i];

              d3.select(body)
              .selectAll(link_id)
              .style("opacity", hidden_opacity)
              d3.select(body)
              .selectAll(link_class)
              .style("opacity", hidden_opacity)

              if (neuron_chain[i] < first_row_size) {
                  d3.select(body)
                  .selectAll("#node_" + neuron_chain[i])
                  .attr("r", radius)
                  .style("opacity", 1)
                  .style("fill", "transparent");
              } else {
                  d3.select(body)
                  .selectAll("#node_" + neuron_chain[i])
                  .style("fill", "transparent");
              }

          }
      }

      neuron_chain = d.chain;
      if (number_of_neurons - d.node <= neurons_at_last_layer) {
          d3.select(this)
          .attr("r", 10)
          .style("opacity", hidden_node_opacity)
          d3.select(body)
          .select("#link_" + d.node)
          .style("opacity", 1)
      }

      var new_text_indexes = [];
      for (var i = 0; i < neuron_chain.length; i++) {

          if (neuron_chain[i] == d.node) {
              d3.select(body)
              .selectAll(".link_" + neuron_chain[i])
              .style("opacity", 1)
              d3.select(body).
              selectAll("#link_" + neuron_chain[i])
              .style("opacity", 1)
          } else if (neuron_chain[i] < d.node) {
              d3.select(body)
              .selectAll("#link_" + neuron_chain[i])
              .style("opacity", 1)
          }

          d3.select(body)
          .selectAll("#node_" + neuron_chain[i])
          .style("fill", "white")

          if (neuron_chain[i] < first_row_size) {

              d3.select(body)
              .selectAll("#node_" + neuron_chain[i])
              .attr("r", 9)
              .style("opacity", hidden_node_opacity)
              .style("fill", function () {
                  return randomColorGenerator(i)
              });

              d3.select(body)
              .select("#node__" + neuron_chain[i])
              .style("opacity", 1);

              new_text_indexes.push([filter_matches[filter_matches_index][2][neuron_chain[i]], i]);

          } else {
              d3.select(body)
              .selectAll("#node_" + neuron_chain[i])
              .style("fill", "white");
              d3.select(body)
              .select("#bp_" + neuron_chain[i])
              .style("filter", "grayscale(100%)")
              .style("opacity", 1)
              .style("-webkit-filter", "grayscale(100%)");
          }
      }

      new_text_indexes.sort(function (a, b) {
          return a[0] - b[0];
      });


      d3.select(body)
      .selectAll("#sequence_p span")
      .remove();
      d3.select(body)
      .select("#sequence_p")
      .text("");

      var sequence_index = 0;
      for (var i = 0; i < new_text_indexes.length; i++) {

          if (new_text_indexes[i][0] >= sequence_index) {

              d3.select(body)
                .select("#sequence_p").
                append("span")
                .text(sequence_fragment.substring(sequence_index, new_text_indexes[i][0]));

              d3.select(body).select("#sequence_p")
                .append("span")
                .attr("class", "highlighted")
                .style("color", function () {
                    return randomColorGenerator(new_text_indexes[i][1]);
                })
                .style("opacity", filter_matches[filter_matches_index][1][sequence_fragment] / 20)
                .text(sequence_fragment.substring(new_text_indexes[i][0], new_text_indexes[i][0] + 10));

          } else {
              var last_span_txt = d3.select(body).select("#sequence_p span:last-child").text()
              sequence_index = sequence_fragment.indexOf(last_span_txt);
              d3.select(body).select("#sequence_p span:last-child")
              .remove();
              d3.select(body).select("#sequence_p")
              .append("span")
              .attr("class", "highlighted")
              .text(sequence_fragment.substring(sequence_index, 10 + new_text_indexes[i][0]));
          }
          sequence_index = 10 + new_text_indexes[i][0];
      }
      d3.select(body)
      .select("#sequence_p")
      .append("span")
      .text(sequence_fragment.substring(sequence_index, sequence_fragment.length - 1));
  }

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
