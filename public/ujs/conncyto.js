var styles = [
  {
    "selector": "node",
    "style": {
      "height": 20,
      "width": 20,
      'content': 'data(name)',
      'text-opacity': 0,
      'text-wrap': 'ellipsis',
      'text-max-width': '150px',
      "background-color": "#969696"
    }
  },
  {
      "selector": ":parent",
      "style": {
          "background-opacity": 0.1
      }
  },

  {
      "selector": "node.cy-expand-collapse-collapsed-node",
      "style": {
          "background-color": "#1f3263",
          "shape": "pentagon"
      }
  },

  {
      "selector": "edge",
      "style": {
          "curve-style" : "bezier",
          "width": 3,
          "line-color": "#ccc",
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#ccc"
      }
  },

  {
      "selector": "edge.meta",
      "style": {
          "width": 2,
          "line-color": "red"
      }
  },

  {
      "selector": ":selected",
      "style": {
          "border-width": 3,
          "border-color": "#DAA520"
      }
  }
];

//var query = document.getElementById('inputQuery').value;

var dataset = document.getElementById('cy').getAttribute('value');


fetch('/cytoData/'+dataset,{mode:'no-cors'})
.then(function(res){
  return res.json();
})
.then(function(elem){
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

  // label html style로 만들기
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

  // 랜덤 색상 선정
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // edge색상 변경
  function sethighlightEdge(node){
    var nowList = node.data('topic');
    for(var now in nowList){
      color = getRandomColor();
      node.successors().each(
        function(e){
          if(e.isEdge() && e.data('topic').includes(nowList[now])){
            e.style('line-color', color);
            e.style('target-arrow-color', color);
            }
      });
      node.predecessors().each(
        function(e){
          if(e.isEdge() && e.data('topic').includes(nowList[now])){
            e.style('line-color', color);
            e.style('target-arrow-color', color);
            }
      });
    }
  }


  // edge색상 초기화
  function removehighlightEdge(t_cy){
    t_cy.edges().forEach(function(target){
      target.style('line-color', "#ccc");
      target.style('target-arrow-color', "#ccc");
    });
  }

  // mouse over시,  edge 색상변경
  cy.on('mouseover','node',function(event){
    var node = event.target;
    sethighlightEdge(node);
  });

  // mouse out시, edge 원상태
  cy.on('mouseout', 'node', function(event) {
    var node = event.target;
    removehighlightEdge(event.cy);
  });

  var clickBefore;

  // click시, article update
  cy.on("click","node", function(event){
    var node = event.target;
    document.getElementById("title").innerHTML = node.data("name");
    document.getElementById("date").innerHTML = (node.data("date")).replace('T',' ');
    document.getElementById("contents").innerHTML = node.data("contents");
  });

  var connNodes = [];
  var connNIds = [];
  //우 클릭시 중복
  cy.on("cxttap","node", function(event){
    var node = event.target;
    var nodename = node.data("name");
    var nodeid = node.data("id");
    var nodetopics = node.data("topic");
    //console.log(nodetopics)
    if(nodetopics.length > 1){
      if(connNodes.includes(nodename)){
        var idx = connNodes.indexOf(nodename)
        connNodes.splice(idx,1);
        connNIds.splice(idx,1);
        document.getElementById('conn').innerHTML = connNodes;
        document.getElementById('Con_articles').value = connNIds;
        node.style('background-color',"yellow")
      }
      else{
        connNodes.push(nodename);
        connNIds.push(nodeid);
        document.getElementById('conn').innerHTML= connNodes;
        document.getElementById('Con_articles').value = connNIds;
        node.style('background-color',"red")
      }
    }
  });

  highlightconnNode(cy);
  function highlightconnNode(t_cy){
    t_cy.nodes().forEach(function(target){
      if(target.data("topic").length >1)
        target.style('background-color',"yellow");
    });
  }

  var api = cy.expandCollapse('get');

});
