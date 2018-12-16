'use strict';
const fs = require('fs');
const currentUser = 'Joren';
const file = process.argv[2];
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

const getDate = (dateStr) => {

  if (!/\d/.test(dateStr[0])) {
    return null;
  }

  let year = dateStr.slice(6, 10);
  let month = parseInt(dateStr.slice(3,5));
  let day = dateStr.slice(0, 2);
  let hour = dateStr.slice(12, 14);
  let min = dateStr.slice(15, 17);
  let sec = dateStr.slice(19);

  return new Date(year, month, day, hour, min, sec);
};

const getUser = (userStr) => {
  let endIndex = userStr.indexOf(':');
  if (endIndex >= 0) {
    return userStr.slice(0, endIndex);
  } else {
    endIndex = userStr.search(/\s(left|created|changed|was|were)/);
    if (endIndex >= 0) {
      systemMessage = true;
      let user = userStr.slice(0, endIndex);
      return user === 'You' ? currentUser : user;
    } else {
      return null;
    }
  }
};

const init = () => {
  let arr = [];
  txtData.split('\n').forEach((potentialNewMessage) => {
    if (!potentialNewMessage.match(/^((\d){2}\/){2}(\d){4}/g)){
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

    obj.date = getDate(line.slice(0, 17));
    obj.user = getUser(line.slice(20));
    
    if (!systemMessage && !obj.user){
      obj.message = line.slice(20);
    } else {
      obj.message = systemMessage ? line.slice(20) : line.slice(22 + obj.user.length);
    }
    
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