# TrocaDeLivros


---

###### .env file
```
PORT=80
NODE_ENV=development or production
MONGODB_URI=mongodb://localhost:27017/
ROOT_URL=https://example.com

PROGRAM_TITLE=Program Title
SESSION_SECRET=YourSecret
TRANSPORTER_EMAIL=example@gmail.com
TRANSPORTER_PASS=password
TRANSPORTER_NAME=Example - Do not Reply
CONTACT_EMAIL=example2@gmail.com

GOOGLEBOOKS_API_KEY=
```

---
##### To build Semantic-UI:

* Go to node_modules/semantic-ui.
* Execute npm install.
* Create semantic.json and src/theme.config files.
* On theme.config, change @form to 'flat' and @loader to 'pulsar'.
* On src/site/globals/site.variables, add @primaryColor   : #a03232;
* Return to node_modules/semantic-ui and execute gulp build.
