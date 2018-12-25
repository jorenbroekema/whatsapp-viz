'use strict';
const fs = require('fs');
const file = process.argv[2];
const currentUser = (process.argv.length > 3) ? process.argv[3] : 'You';
const format = (process.argv.length > 4) ? process.argv[4] : 'MM/dd/yyyy, hh:mm';  // 'M/d/yy, hh:mm';
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
  const regexAndPartGroup = dateFormatToRegex(format);
  let regex = regexAndPartGroup.regex;
  let partGroup = regexAndPartGroup.partGroup;

  let arr = [];
  txtData.split('\n').forEach((potentialNewMessage) => {
    if (!potentialNewMessage.match(/^((\d){1,2}\/){2}(\d){2,4}/g)){
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

    const dateAndLineRemaining = getDate(line, regex, partGroup);
    obj.date = dateAndLineRemaining.date;

    const userAndLineRemaining = getUser(dateAndLineRemaining.lineRemaining);
    obj.user = userAndLineRemaining.user;
    obj.message = userAndLineRemaining.lineRemaining;
    
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

const dateFormatToRegex = (format) => {
  // Parts:  Year, month, day, hour, minute, second.
  let partLetter = [ 'y', 'M', 'd', 'h', 'm', 's' ];
  let partFound = [ false, false, false, false, false, false ];
  let partGroup = [ -1, -1, -1, -1, -1, -1 ];

  let regex = "";
  let specials = "[\\/^$.|?*+()";

  let i = 0;
  let group = 0;
  while (i < format.length) {
    let c = format[i];
    let iPart = partLetter.indexOf(c);
    if (iPart == -1) {
      if (specials.includes(c)) {
        regex = regex.concat("\\" + c);
      } else {
        regex = regex.concat(c);
      }
    } else {
      if (partFound[iPart])
        throw "Invalid format string! Don\'t repeat any components!";
      partFound[iPart] = true;
      partGroup[iPart] = group;
      group++;
      if (iPart == 0) {
        if (i+3 < format.length && format[i+1] == c && format[i+2] == c && format[i+3] == c) {
          regex = regex.concat("(\\d{4})");
          i += 3;
        } else if (i+1 < format.length && format[i+1] == c) {
          regex = regex.concat("(\\d{2})");
          i += 1;
        } else {
          throw "Invalid format string! Use yy or yyyy once for the year!";
        }
      } else {
        if (i+1 < format.length && format[i+1] == c) {
          regex = regex.concat("(\\d{2})");
          i += 1;
        } else {
          regex = regex.concat("(\\d{1,2})");
        }
      }
    }
    i++;
  }

  return { regex, partGroup };
}

const getDate = (line, regex, partGroup) => {
  let result = line.match(new RegExp("^" + regex));

  // Defaults:
  let sec = 0;
  let min = 0;
  let hour = 0;
  let day = 1;
  let month = 0;
  let year = 1970;
  
  switch (result.length) {
    case 7: sec = parseInt(result[partGroup[5]+1]);
    case 6: min = parseInt(result[partGroup[4]+1]);
    case 5: hour = parseInt(result[partGroup[3]+1]);
    case 4: day = parseInt(result[partGroup[2]+1]);
    case 3: month = parseInt(result[partGroup[1]+1]) - 1;  // -1 because the months of js Date are 0-based.
    case 2: year = (result[partGroup[0]+1].length == 4)
                ? parseInt(result[partGroup[0]+1])
                : parseInt(result[partGroup[0]+1]) + 2000;
  }

  let matchLength = result[0].length;
  let lineRemaining = line.slice(matchLength);

  let date = new Date(year, month, day, hour, min, sec);

  return { date, lineRemaining };
};

const getUser = (line) => {
  line = line.slice(3); // Remove leading " - ".
  let endIndex = line.search(/(:| left| created| changed| was| were)/);
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