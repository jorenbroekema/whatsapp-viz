let userAndMessageCountList = [
  { "text": "Annabel 15", "value": 15, "font-size": "40px" },
  { "text": "Bobby 23", "value": 23 },
  { "text": "Cornelis 5", "value": 5 },
  { "text": "Dirk-Jan 10", "value": 10 },
  { "text": "Evelien 34", "value": 34 },
  { "text": "Fabio 12", "value": 12 },
];

function renderTreemap(userAndMessageCountList) {
  // Define the chart:
  const chartData = {
    plotarea: {
        margin:"40 0 0 0"
    },
    options:{
      "split-type" : "balanced"
    },
    type: 'treemap',
    title: {
      text: 'Treemap of People & Message Count'
    },
    series: userAndMessageCountList
  };
  
  // Render:
  zingchart.FONTSIZE = 40;
  zingchart.render({
    id: 'chartDiv',
    data: chartData,
    height: "950"
  });
}

renderTreemap(userAndMessageCountList);