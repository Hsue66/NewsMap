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

//document.getElementById('incoh').innerHTML="hello";

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
      //console.log(target.data("topic")[0])
      if(redTopics.includes(target.data("topic")[0])){
        target.style('line-color', "red");
        target.style('target-arrow-color', "red");
      }else{
        target.style('line-color', "#ccc");
        target.style('target-arrow-color', "#ccc");
      }
    });
  }

  function setRedunEdge(node,topic){
    color = "red";
    //console.log(node.data('topic'))
    //console.log(topic)
    node.predecessors().each(
      function(e){
        if(e.isEdge() && e.data('topic').includes(topic)){

          e.style('line-color', color);
          e.style('target-arrow-color', color);
          }
    });
    node.successors().each(
      function(e){
        if(e.isEdge() && e.data('topic').includes(topic)){
          e.style('line-color', color);
          e.style('target-arrow-color', color);
          }
    });
  }

  var redTopics = []
  // edge click시,  edge 색상변경
  cy.on('cxttap','edge',function(event){
    var edge = event.target;
    var pre =
    '[id="'+edge.data("source")+'"]';
    var topic = edge.data("topic")[0];

    if(redTopics.includes(topic)){
      var idx = redTopics.indexOf(topic)
      redTopics.splice(idx,1);
//      document.getElementById('redtl').innerHTML= redTopics;
      document.getElementById('topics').value = redTopics;
      //스타일 바꾸기
      removehighlightEdge(event.cy);
    }
    else{
      redTopics.push(topic);
//      document.getElementById('redtl').innerHTML= redTopics;
      document.getElementById('topics').value = redTopics;
      setRedunEdge(cy.nodes(pre),edge.data("topic")[0]);
    }
  });

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

  var api = cy.expandCollapse('get');

});
