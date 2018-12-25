fetch('./whatsapp-data/example.json').then((response) => {
  return response.json();
}).then((json) => {
  const dataByUser = sortMessagesByUser(json.data);
  renderDoughtnut(dataByUser);
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

const renderDoughtnut = (data) => {
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