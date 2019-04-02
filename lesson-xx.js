fetch('./whatsapp-data/WhatsApp Chat with YC HEROES.json')
  .then(response => response.json())
  .then(json => {
    const messagesByUser = json.data.reduce((messagesByUser, message) => {
      (messagesByUser[message.user] = messagesByUser[message.user] || []).push(message);
      return messagesByUser;
    }, {});
    const userAndMessageCountList = Object.keys(messagesByUser).map(user => {
      return {
        "text": user + " " + messagesByUser[user].length,
        "value": messagesByUser[user].length
      }
    });
    renderTreemap(userAndMessageCountList);
  });

function renderTreemap(userAndMessageCountList) {
  // Define the chart:
  const chartData = {
    plotarea: {
        margin:"40 0 0 0"
    },
    "options":{
      "split-type" : "balanced"
    },
    type: 'treemap',
    title: {
      text: 'Treemap of People & Message Count'
    },
    series: userAndMessageCountList
  };

  // Render:
  zingchart.FONTSIZE = 11;
  zingchart.render({
    id: 'chartDiv',
    data: chartData,
    height: "950"
  });
}