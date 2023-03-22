const express = require("express");
const { json, response } = require("express");
const cors = require('cors');
const http = require('http');
const { URL } = require('url');

let webhooks = {
    "abcx": "https://webhook.site/affe164c-89cd-453c-9322-42d01ca84c4f"
}

const app = express();
const port = 1177;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

const parseHostName = (value) => {
    const urlObj = new URL(value);
    const hostnameRegex = /^([\w.-]+)/;
    const pathRegex = /^([\w/.-]+)/;
    const hostname = urlObj.hostname.match(hostnameRegex)[0];
    const path = urlObj.pathname.match(pathRegex)[0];

    const options = {
        hostname: `${hostname}`,
        path: `${path}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    return options;
};

app.post("/webhook", (req, res) => {
    let postURL = webhooks[req.body["token"]];

    if (postURL == undefined || postURL == null || postURL == NaN) {
        return;
    }
    let options = parseHostName(postURL);
    const request = http.request(options, (res2) => {
        console.log(`statusCode: ${res2.statusCode}`);

        res2.on('data', (d) => {
            process.stdout.write(d);
        })
    })
    let tempDict = {
        message: `${req.body["data"]}`
    };
    request.write(JSON.stringify(tempDict));
    request.end();
});