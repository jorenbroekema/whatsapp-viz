'use strict';
const fs = require('fs');
const file = process.argv[2];
const currentUser = process.argv[3];
const flags = process.argv.slice(2);
const omitMedia = flags.indexOf('-o') >= 0;
const noType = flags.indexOf('-t') >= 0;

let txtData, systemMessage;

if (file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    txtData = data;

    init();
  });
}

const init = () => {
  let arr = [];
  txtData.split('\n').forEach((potentialNewMessage) => {
    if (!potentialNewMessage.match(/^((\d){1,2}\/){2}(\d){1,4}/g)){
      arr[arr.length - 1] += ('\n' + potentialNewMessage);
    } else {
      arr.push(potentialNewMessage);
    }
  });

  let jsonData = { data: [] };

  for (let i = 0, len = arr.length; i < len; i ++) {
    let line = arr[i].trim();
    if (!line.length || (omitMedia && (line.indexOf(' omitted>') >= 0))) {
      continue;
    }

    let obj = {};
    systemMessage = false;

    var { date, lineRemaining } = getDate(line);
    obj.date = date;

    var { user, lineRemaining } = getUser(lineRemaining);
    obj.user = user;
    obj.message = lineRemaining;
    
    if (!noType) {
      obj.type = systemMessage ? 'action' : 'message';
    }

    jsonData.data.push(obj);
  }

  const jsonUrl = `${file.slice(0, -4)}.json`;

  fs.writeFile(jsonUrl, JSON.stringify(jsonData), (err) => {
    if (err) {
      throw err;
    }
    console.log(`Written to ${jsonUrl}`);
  })
};

const getDate = (line) => {
  var result = line.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4}), (\d{1,2}):(\d{1,2})/);
  if (result.length != 6) {   // Entire match, 1st group, ..., 5th group.
    let date = null;
    return { date, line };
  }

  // Note the order: Month, Day, Year, Hour, Second. America.
  let year = (result[3].length == 4) ? parseInt(result[3]) : parseInt(result[3]) + 2000;
  let month = parseInt(result[1]) - 1;  // -1 because the months of js Date are 0-based.
  let day = parseInt(result[2]);
  let hour = parseInt(result[4]);
  let min = parseInt(result[5]);
  let sec = 0;

  let matchLength = result[0].length;
  let lineRemaining = line.slice(matchLength);

  let date = new Date(year, month, day, hour, min, sec);

  return { date, lineRemaining };
};

const getUser = (line) => {
  line = line.slice(3); // Remove leading " - ".
  let endIndex = line.search(/(:|left|created|changed|was|were)/);
  if (endIndex >= 0) {
    systemMessage = true;
    let rawUser = line.slice(0, endIndex);
    let user = (rawUser === 'You') ? currentUser : rawUser;
    
    user = user.replace('\u202A', '');    // Remove annoying unicode reversing character.
    user = user.replace('\u202C', '');    // Remove annoying unicode directional character.

    let lineRemaining = line.slice(endIndex);
    if (lineRemaining[0] === ':') lineRemaining = lineRemaining.slice(2); // Remove leading colon and space from message, if necessary.
    
    return { user, lineRemaining }
  } else {
    let user = null;
    return { user, line };
  }
};