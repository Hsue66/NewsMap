/***********************************************************************
  TopicMap : Web application for visualizing a news map generated by TopicMaps
  Authors: Sumin Hong (hsue0606@gmail.com), U Kang (ukang@snu.ac.kr)
  Data Mining Lab., Seoul National University

-------------------------------------------------------------------------
File: drawMapB.js
 - A javascript file for drawing map B from the bestMap page.

Version: 1.0
***********************************************************************/

var dataset = document.getElementById('datadiv1').getAttribute('value');

// Read the selected JSON file
fetch('/cytoData/'+dataset,{mode:'no-cors'})
.then(function(res){
  return res.json();
})
.then(function(elem){
  // Set the default values for Cytoscape
  var cy = cytoscape({
    container: document.getElementById('cy1'),
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
    document.getElementById("title1").innerHTML = node.data("name");
    document.getElementById("date1").innerHTML = (node.data("date")).replace('T',' ');
    document.getElementById("contents1").innerHTML = node.data("contents");
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
      var etopic = target.data('topic')[0];
      var color = colorShade[allTopics[etopic]];
      target.style('line-color', color);
      target.style('target-arrow-color', color);
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
