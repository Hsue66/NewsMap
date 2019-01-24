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
      "background-color": "#b2b2b2"
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
          "border-color": "#4c4c4c"
      }
  }
];

var colorPreset = ["#ff3333","#ff5733","#ff8a33","#ffbd33","#fff033",
"#dbff33","#a8ff33","#33ff94","#33f3ff","#33c0ff",
"#338dff","#335aff","#3f33ff","#7233ff","#a533ff",
"#d833ff","#ff33f3","#ff33c0","#ff338d"];

var colorShade = ["#b22323","#CF664F","#CF854F","#CFA74F","#CFC84F",
"#B8CF4F","#99CF4F","#23b267","#4FCFCF","#2899cc",
"#598EBF","#4052a5","#49528b","#7855B4","#9655B4",
"#B94EB6","#CF50C8","#CF50A8","#CF5085"];
