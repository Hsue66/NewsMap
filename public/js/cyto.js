var styles = [
  {
    "selector": "node",
    "style": {
      "height": 20,
      "width": 20,
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
          "background-color": "#b00004",
          "shape": "rectangle"
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

var query = window.location.search.split('=')[1];

fetch('/cytoData/'+query+'Data.json',{mode:'no-cors'})
.then(function(res){
  return res.json();
})
.then(function(elem){
  var cy = cytoscape({
      container: document.getElementById('cy'),
      minZoom: 0.8,
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

  // hidden될 label을 가지는 ID array
  var hiddenStat = [];

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
              if(hiddenStat.includes(data.id)){
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

  // expand 후, parent label없애기
  cy.nodes().on("expandcollapse.afterexpand", function(event){
    var node = this;
    hiddenStat.push(node.id());
    //console.log(hiddenStat);
  });

  // collapse 후, 지웠던 라벨 보이게
  cy.nodes().on("expandcollapse.aftercollapse", function(event){
    var node = this;
    //console.log(hiddenStat);
    var idx = hiddenStat.indexOf(node.id());
    hiddenStat.splice(idx, 1);
    //console.log(hiddenStat);
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

  // click시, article update
  cy.on("click","node", function(event){
    var node = event.target;
    document.getElementById("title").innerHTML = node.data("name");
    document.getElementById("date").innerHTML = node.data("date");
    document.getElementById("contents").innerHTML = node.data("contents");
  });

  var api = cy.expandCollapse('get');

  document.getElementById("expandAll").addEventListener("click", function () {
    api.expandAll();
  });

  document.getElementById("collapseAll").addEventListener("click", function () {
    api.collapseAll();
  });
});
