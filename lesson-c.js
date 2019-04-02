let data = [
  {
    "date":"2013-04-26T14:12:00.000Z",
    "user":"Nick",
    "message":" created group \"Team 15\"",
    "type":"action"
  },
  {
    "date":"2013-04-26T14:12:00.000Z",
    "user":"John Doe",
    "message":" were added",
    "type":"action"
  },
  {
    "date":"2015-12-29T20:07:00.000Z",
    "user":"Jack",
    "message":"Welcome!",
    "type":"action"
  },
  {
    "date":"2015-12-29T20:08:00.000Z",
    "user":"John Doe",
    "message":"Thanks! :)",
    "type":"action"
  }
];

const messagesByUser = groupMessagesByUser(data);
const userAndMessageCountList = messagesByUserToMessageCounts(messagesByUser);
renderTreemap(userAndMessageCountList);

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

function messagesByUserToMessageCounts(messagesByUser) {
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