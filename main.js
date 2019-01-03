fetch('./whatsapp-data/example.json').then((response) => {
  return response.json();
}).then((json) => {
  const dataByUser = sortMessagesByUser(json.data);
  //renderDoughnut(dataByUser);
  renderTreemap(dataByUser);
});

const sortMessagesByUser = data => {
  let dataByUser = {};
  data.forEach((message) => {
    if (message.user !== null) {
      if (!dataByUser[message.user]) {
        dataByUser[message.user] = [];
      }
      dataByUser[message.user].push(message);
    }
  });
  return dataByUser;
};

const renderDoughnut = (data) => {
  let doughnut = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      }],
      labels: [],
    },
    options: {
      /* scale: {
        display: false,
      } */
    },
  };
  
  Object.keys(data).forEach((user, index) => {
    // Add the data
    doughnut.data.datasets[0].data.push(data[user].length);
    doughnut.data.labels.push(user);

    // Set some random (but distributed) colors
    const chunks = 360 / Object.keys(data).length;
    let hue = Math.random();
    hue = hue * (chunks * (index + 1) - chunks * index) + (chunks * index);

    const saturation = 50;
    const brightness = 70;
    doughnut.data.datasets[0].backgroundColor.push(`hsl(${hue}, ${saturation}%, ${brightness}%)`);
    doughnut.data.datasets[0].hoverBackgroundColor.push(`hsl(${hue}, ${saturation}%, ${brightness - 5}%)`);
  });
  
  var ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    ...doughnut
  });
}

const renderTreemap = (data) => {
  // Put the data into the right form for a treemap:
  let series = [];
  Object.keys(data).forEach(function(key) {
    series.push(
      {
        "text": key + " " + data[key].length,
        "value": data[key].length
      }
    )
  })

  // Set some random (but distributed) colors:
  let nUsers = Object.keys(data).length;
  let n = Math.ceil(Math.pow(nUsers, 0.333333));
  let palette = [];
  Object.keys(data).forEach((user, index) => {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    let rBias = 255; let gBias = 114; let bBias = 42; // Bias the colors around YC Orange.

    let r = Math.floor((((index / (n*n) % n)) * (255 - rBias)) / n) + rBias;
    let g = Math.floor((((index / n) % n) * (255 - gBias)) / n) + gBias;
    let b = Math.floor(((index % n) * (255 - bBias)) / n) + bBias;

    let hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    console.log(hex);
    palette.push(hex);
  })

  // Define the chart:
  let chartData = {
    plotarea: {
       margin:"40 0 0 0"
    },
    "options":{
      "aspect-type":"palette",
      "palette":palette
    },
    type: 'treemap',
    title: {
      text: 'Treemap of People & Message Count'
    },
    series: series
  };

  // Render:
  zingchart.render({
    id: 'chartDiv',
    data: chartData,
    height: 950,
  });
}