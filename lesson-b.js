fetch('./whatsapp-data/WhatsApp Chat with YC HEROES.json')
  .then(response => response.json())
  .then(json => {
    const messagesByUser = groupMessagesByUser(json.data);
    const userAndMessageCountList = messagesByUserToUserAndMessageCountList(messagesByUser);
    renderTreemap(userAndMessageCountList);
  });

function groupMessagesByUser(messages) {
  let messagesByUser = {};
  messages.forEach(message => {
    const user = message.user;
    if (user !== null) {
      if (!messagesByUser[user]) {
        messagesByUser[user] = [];
      }
      messagesByUser[user].push(message);
    }
  });
  return messagesByUser;
}

function messagesByUserToUserAndMessageCountList(messagesByUser) {
  // Put the data into the right form for a treemap:
  let userAndMessageCountList = [];
  const users = Object.keys(messagesByUser);
  users.forEach(user => {
    const messages = messagesByUser[user];
    const messageCount = messages.length;
    userAndMessageCountList.push(
      {
        "text": user + " " + messageCount,
        "value": messageCount
      }
    )
  })
  return userAndMessageCountList;
}

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