var dataset = document.getElementById('cy').getAttribute('value');

document.getElementById('articlesN').value = 0;
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

  // edge색상 초기화
  function removehighlightEdge(t_cy){
    t_cy.edges().forEach(function(target){
      var etopic = target.data('topic')[0];
      var color = colorShade[allTopics[etopic]];
      target.style('line-color', color);
      target.style('target-arrow-color', color);
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

  // click시, article update
  cy.on("click","node", function(event){
    var node = event.target;
    document.getElementById("title").innerHTML = node.data("name");
    document.getElementById("date").innerHTML = (node.data("date")).replace('T',' ');
    document.getElementById("contents").innerHTML = node.data("contents");
  });

  var incohNodes = [];
  var incohNIds = [];
  //우 클릭시 중복
  cy.on("cxttap","node", function(event){
    var node = event.target;
    var nodename = node.data("name")
    var nodeid = node.data("id")
    if(incohNodes.includes(nodename)){
      var idx = incohNodes.indexOf(nodename)
      incohNodes.splice(idx,1);
      incohNIds.splice(idx,1);
      var str = '';
      incohNodes.forEach(function(i){
        str = str+i+"</br>";
      });
      document.getElementById('incoh').innerHTML = str;
      document.getElementById('articles').value = incohNIds;
      document.getElementById('articlesN').value = incohNIds.length;
      node.style('background-color',"#b2b2b2")
    }
    else{
      incohNodes.push(nodename);
      incohNIds.push(nodeid);
      var str = '';
      incohNodes.forEach(function(i){
        str = str+i+"</br>";
      });
      document.getElementById('incoh').innerHTML= str;
      document.getElementById('articles').value = incohNIds;
      document.getElementById('articlesN').value = incohNIds.length;
      node.style('background-color',"#d32f2f")
    }
  });

  var api = cy.expandCollapse('get');

  var allTopics = {};
  var cidx = Math.floor(Math.random() * 19);
  highlightTimeline(cy);


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
