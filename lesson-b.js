let messagesByUser = {
  "Annabel" : [
    {user: "Annabel", message: "Hoi! :)"},
    {user: "Annabel", message: "Ik ben Annabel"},
    {user: "Annabel", message: "Nou dan niet hoor"}
  ],
  "Bobby" : [
    {user: "Bobby", message: "Wees eens still Annabel"},
    {user: "Bobby", message: "We proberen hier te programmeren"}
  ],
  "Cornelis" : [
    {user: "Cornelis", message: "Hoi Annabel"}
  ]
};

const userAndMessageCountList = messagesByUserToUserAndMessageCountList(messagesByUser);
renderTreemap(userAndMessageCountList);

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
  zingchart.FONTSIZE = 30;
  zingchart.render({
    id: 'chartDiv',
    data: chartData,
    height: "950"
  });
}