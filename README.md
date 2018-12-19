## How to run
Before you can run the local web server that will allow you to see your website, you need to install some dependencies. This is done with the following command, which you can execute with Git Bash:
```sh
npm install
```

Download your WhatsApp data following the guide that should be in the same folder as this file. This should give you a .txt file, which you should put in the whatsapp-data folder.

From the root folder, convert it to .json data by executing the following command with Git Bash:
```sh
node chat-to-obj.js "whatsapp-data/[filename].txt" "[your name]"
```

Open main.js in a text editor and make sure that the filename used in the fetch matches the filename of your WhatsApp data. The default filename is `whatsapp.json`.

Run the web server by executing the following command with Git Bash:
```sh
npm run start
```
