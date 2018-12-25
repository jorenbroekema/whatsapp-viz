## How to run
Before you can run the local web server that will allow you to see your website, you need to install some dependencies. This is done with the following command, which you can execute with Git Bash:
```sh
npm install
```

Download your WhatsApp data following the guide that should be in the same folder as this file. This should give you a .txt file, which you should put in the whatsapp-data folder.

From the root folder, convert it to .json data by executing the following command with Git Bash:
```sh
node chat-to-obj.js "whatsapp-data/[filename].txt" "[your name]" "[date format]"
```
Your name and the date format are optional, and default to "You" and "MM/dd/yyyy, hh:mm". If your phone's language is not set to Dutch, you might have to provide a different date format.

Open main.js in a text editor and make sure that the filename used in the fetch matches the filename of your WhatsApp data. The default filename is `example.json`.

Run the web server by executing the following command with Git Bash:
```sh
npm run start
```
