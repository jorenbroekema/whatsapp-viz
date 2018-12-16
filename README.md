## How to run
Install dependencies
```sh
npm install
```

Download your whatsapp data
Put the .txt file in the whatsapp-data folder

From the root folder, convert it to .json data
```sh
node chat-to-obj.js whatsapp-data/[filename].txt
```
Make sure the fetch in main.js reflects the filename. By default it is set to fetch `whatsapp.json`

Run the simple web server
```sh
npm run start
```
