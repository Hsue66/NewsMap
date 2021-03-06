/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University
  
-------------------------------------------------------------------------
File: convert.js
 - A supplementary file for controller.js.
 - This converts the uploaded files to a map.

Version: 1.0
***********************************************************************/

/*jshint sub:true*/
// Load the required modules that convert.js needs
var fs = require("fs");

/**
 * Read two uploaded files, the datset.json and sample.json and Create a map
 *
 * @return the result.json file containing generated map
 */
var convert = function(){
  // read dataset and TopicMaps result from each file
  var dataset = JSON.parse(fs.readFileSync('uploads/dataset.json', 'utf8'));
  var Bresult = JSON.parse(fs.readFileSync('uploads/sample.json', 'utf8'));

  var result = [];
  for(var d in Bresult){
    timeline = {};
    var nodes = Bresult[d]["line"];
    var clusters = Bresult[d]["clustering"];
    var representation = Bresult[d]["representation"];

    if(representation !== undefined){
      line = [];
      cluster = [];
      for(var i =0; i<representation.length; i++){
        if(representation[i] === 1){
          line.push(nodes[i]);
          cluster.push(clusters[i]);
        }
      }
      timeline['line'] = line;
      timeline['clustering'] = cluster;
    }else{
      timeline['line'] = nodes;
      timeline['clustering'] = clusters;
    }
    result.push(timeline);
  }

  var vis = [];         // final result will be saved on this variable
  var topicIdx = 1;

  var allNodes = [];
  var nodesNdates = {};

  // generate edge data
  for(var d in result){
    var nodes = result[d]["line"];
    var clusters = result[d]["clustering"];
    allNodes=allNodes.concat(nodes);

    for(var n=0; n<nodes.length; n++)
      nodesNdates[nodes[n]] = dataset[nodes[n]]['date'];

    for(var n=0; n<nodes.length-1; n++){
      edgeDict = {};
      data = {};
      edgeDict["group"] = "edges";
      data["source"]= nodes[n].toString();
      data["target"]= nodes[n+1].toString();
      data["topic"] = [topicIdx.toString()];
      edgeDict["data"] = data;
      vis.push(edgeDict);
    }
    topicIdx = topicIdx+1;
  }

  // set node position
  var sortable = [];
  for(var n in nodesNdates)
    sortable.push([n, nodesNdates[n]]);

  var nodeNpos = {};
  var x = 0;
  sortable.forEach(function(n){
    nodeNpos[n[0]] = x;
    x = x+ 150;
  });
  // console.log(nodeNpos);

  // generate node data
  y = 100;
  topicIdx = 0;
  already = [];
  nodeElems = {};
  result.forEach(function(d){
    nodes = d["line"];
    clusters = d["clustering"];

    before = 0;
    nodeByG = [];
    temp = [];
    for(var i=0; i<clusters.length; i++){
      if(clusters[i] !== before){
          nodeByG.push(temp);
          temp = [];
          before = clusters[i];
      }
      temp.push(nodes[i]);
    }
    nodeByG.push(temp);

    y = y + 100;
    topicIdx = topicIdx+1;
    nodeByG.forEach(function(group){
      flag = 0;
      parent = "";
      // if more than one element, one node will be parent node
      if (group.length > 1){
        flag = 1;
        n = group[0];
        nodeDict = {};
        nodeDict["group"] = "nodes";
        ndata = {};
        ndata["id"] = 'c'+n.toString();
        parent = ndata["id"];
        ndata["name"] = dataset[n]['title'];
        ndata["date"] = dataset[n]['date'];
        ndata["contents"] = dataset[n]['contents'];
        ndata["erasable"] = true;
        ndata["topic"] = [topicIdx.toString()];
        nodeDict["data"] = ndata;
        ty = y+Math.floor(Math.random() * 10);
        positions = {};
        positions['x'] = nodeNpos[n];
        positions['y'] = ty;
        nodeDict["position"] = positions;
        nodeElems[ndata["id"]] = nodeDict;
      }

      group.forEach(function(n){
        if(!already.includes(n)){
          nodeDict = {};
          nodeDict["group"] = "nodes";
          ndata = {};
          ndata["id"] = n.toString();
          ndata["name"] = dataset[n]['title'];
          ndata["date"] = dataset[n]['date'];
          ndata["contents"] = dataset[n]['contents'];
          ndata["erasable"] = false;
          ndata["topic"] = [topicIdx.toString()];
          if(flag === 1)
              ndata["parent"] = parent;
          nodeDict["data"] = ndata;

          ty = y+Math.floor(Math.random() * 10);
          positions = {};
          positions['x'] = nodeNpos[n];
          positions['y'] = ty;
          nodeDict["position"] = positions;
          already.push(n);
          nodeElems[n] = nodeDict;
        }
        else{
          nodeElems[n]["data"]["topic"].push(topicIdx.toString());
        }
      });
    });
  });


  Object.keys(nodeElems).forEach(function(key) {
    //console.log(key, nodeElems[key]);
    vis.push(nodeElems[key]);
  });

  // save generated variable to result.json
  fs.writeFileSync("cytoData/result.json", JSON.stringify(vis), (err) => {
      if (err) {
          console.error(err);
          return;
      }
      console.log("File has been created");
  });
}

exports.convert = convert;
