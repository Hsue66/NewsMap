/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

-------------------------------------------------------------------------
File: drawMapWcEdges.js
 - a Javascript file to draw Map which can select redundant edges

Version: 1.0
***********************************************************************/

var dataset = document.getElementById('cy').getAttribute('value');
document.getElementById('topicsN').value = 0;

// Read the result JSON file
fetch('/cytoData/'+dataset,{mode:'no-cors'})
.then(function(res){
  return res.json();
})
.then(function(elem){
  // Set the default values for Cytoscape
  var cy = cytoscape({
      container: document.getElementById('cy'),
      pan: { x: 0, y: 0 },
      zoom: 1,
      minZoom: 0.7,
      maxZoom: 5,
      wheelSensitivity: 0.4,
      style: styles,
      elements: elem,
      ready: function(){
        var api = this.expandCollapse({
          layoutBy: {
            name: "preset",
            animate: "end",
            randomize: false,
            fit: true
          },
          fisheye: false,
          animate: false,
          undoable: false
        });
        api.collapseAll();
      },
      layout: {
        name: 'preset'
      }
  });

  // Customize the label of Cytoscape by nodeHtmlLabel
  cy.nodeHtmlLabel([
      {
          query: 'node',
          cssClass: 'cy-title',
          valign: "top",
          valignBox: "top",
          tpl: function (data) {
              var p1 = '<p class="cy-title__name"';
              var p2 = '<p  class="cy-title__info"';
              if(!api.isExpandable(cy.getElementById(data.id)) && data.erasable){
                p1 += 'hidden';
                p2 += 'hidden';
              }
              return p1+' >'+ data.name + '</p>' +
                  p2+' >' + data.date.slice(0,10) + '</p>';
          }
      }
  ]);

  var redTopics = []

  // right-click, update redundant edges
  cy.on('cxttap','edge',function(event){
    var edge = event.target;
    var pre =
    '[id="'+edge.data("source")+'"]';
    var topic = edge.data("topic")[0];

    if(redTopics.includes(topic)){
      var idx = redTopics.indexOf(topic)
      redTopics.splice(idx,1);
      document.getElementById('topics').value = redTopics;
      document.getElementById('topicsN').value = redTopics.length;

      removehighlightEdge(event.cy);
    }
    else{
      redTopics.push(topic);
      document.getElementById('topics').value = redTopics;
      document.getElementById('topicsN').value = redTopics.length;
      setRedunEdge(cy.nodes(pre),edge.data("topic")[0]);
    }
  });

  // mouse over,  change edge color
  cy.on('mouseover','node',function(event){
    var node = event.target;
    sethighlightEdge(node);
  });

  // mouse out, return edge color
  cy.on('mouseout', 'node', function(event) {
    var node = event.target;
    removehighlightEdge(event.cy);
  });

  // click, update article data to HTML
  cy.on("click","node", function(event){
    var node = event.target;
    document.getElementById("title").innerHTML = node.data("name");
    document.getElementById("date").innerHTML = (node.data("date")).replace('T',' ');
    document.getElementById("contents").innerHTML = node.data("contents");
  });

  var api = cy.expandCollapse('get');

  /**
   * Highlights edges with the same topic as the mouse was overlayed.
   *
   * @param node
   *    a mouse overlayed node
   */
  function sethighlightEdge(node){
    var nowList = node.data('topic');
    for(var now in nowList){
      node.successors().each(
        function(e){
          if(e.isEdge() && e.data('topic').includes(nowList[now])){
            var color = colorPreset[allTopics[e.data('topic')]];
            e.style('line-color', color);
            e.style('target-arrow-color', color);
            }
      });
      node.predecessors().each(
        function(e){
          if(e.isEdge() && e.data('topic').includes(nowList[now])){
            var color = colorPreset[allTopics[e.data('topic')]];
            e.style('line-color', color);
            e.style('target-arrow-color', color);
            }
      });
    }
  }

  /**
   * Return the highlighted edge to its original color
   *
   * @param t_cy
   *    an event that the mouse pointer leaves the node
   */
  function removehighlightEdge(t_cy){
    t_cy.edges().forEach(function(target){
      if(redTopics.includes(target.data("topic")[0])){
        target.style('line-color', "red");
        target.style('target-arrow-color', "red");
      }else{
        var etopic = target.data('topic')[0];
        var color = colorShade[allTopics[etopic]];
        target.style('line-style', "solid");
        target.style('line-color', color);
        target.style('target-arrow-color', color);
      }
    });
  }

  /**
   * Return the highlighted edge to its original color
   *
   * @param node
   *    One of the nodes in the timeline.
   * @param topic
   *    A topic value in the timeline
   */
  function setRedunEdge(node,topic){
    color = "red";
    node.predecessors().each(
      function(e){
        if(e.isEdge() && e.data('topic').includes(topic)){
          e.style('line-style', "dashed");
          e.style('line-color', color);
          e.style('target-arrow-color', color);
          }
    });
    node.successors().each(
      function(e){
        if(e.isEdge() && e.data('topic').includes(topic)){
          e.style('line-style', "dashed");
          e.style('line-color', color);
          e.style('target-arrow-color', color);
          }
    });
  }

  var allTopics = {};
  var cidx = Math.floor(Math.random() * 19);
  highlightTimeline(cy);

  /**
   * Displays all the timelines according to the color of the topic.
   *
   * @param t_cy
   *    the cy value
   */
  function highlightTimeline(t_cy){
    t_cy.edges().forEach(function(target){
      var etopic = target.data('topic')[0];
      if(!(Object.keys(allTopics).includes(etopic))){
        allTopics[etopic] = cidx;
        cidx = (cidx + 3)%19;
      }
      var color = colorShade[allTopics[etopic]];
      target.style('line-color', color);
      target.style('target-arrow-color', color);
    });
  }
});
